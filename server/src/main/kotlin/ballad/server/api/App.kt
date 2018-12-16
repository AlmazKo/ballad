package ballad.server.api

import ballad.server.game.Game
import ballad.server.game.GameMap
import ballad.server.map.Lands
import ballad.server.map.MapParser
import ballad.server.toJson
import io.vertx.core.Vertx
import io.vertx.core.http.HttpMethod
import io.vertx.core.http.HttpServer
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.CorsHandler
import io.vertx.ext.web.handler.LoggerFormat
import io.vertx.ext.web.handler.LoggerHandler
import io.vertx.ext.web.handler.StaticHandler
import java.util.*
import java.util.concurrent.atomic.AtomicInteger

class App(vertx: Vertx) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val playerInc = AtomicInteger(0)
    private var game: Game
    private var map: GameMap

    init {
        val lands = loadLands()
        this.map = GameMap(lands)
        this.game = Game(vertx, map)
        val opts = HttpServerOptions().apply {
            port = 80
        }
        val server = vertx.createHttpServer(opts)

        initApi(vertx, lands, server)

        server.listen {
            if (it.failed()) {
                log.info("Fail!", it.cause())
                vertx.close()
            } else {
                log.info("Started!")
            }

        }
    }

    private fun initApi(vertx: Vertx, lands: Lands, server: HttpServer) {
        val router = Router.router(vertx)
        router.route().handler(LoggerHandler.create(LoggerFormat.SHORT))

        initCors(router)


        router.route("/admin").handler { ctx ->
            val ws = ctx.request().upgrade()
            game.onEndTick {
                ws.writeFinalTextFrame(JsonArray(map.creatures.toList()).toString())
            }
        }

        router.route("/ws").handler { ctx ->
            val ws = ctx.request().upgrade()
            val id = playerInc.incrementAndGet()
            log.info("Connected player: #$id")
            val p = map.addPlayer(id)
            PlayerSession(p, ws, game)
        }


        router.route("/res/*").handler(StaticHandler.create("../resources"))

        router.get("/map").handler { req ->
            val vp = ViewMap(lands.width, lands.height, lands.offsetX, lands.offsetY, lands.basis, lands.objects)
            req.response().putHeader("content-type", "application/json; charset=utf-8")
            req.response()
                .end(
                    """{"width":${vp.width}, "height":${vp.heigt},"offsetX":${vp.offsetX}, "offsetY":${vp.offsetY},
                    |"terrain":[${vp.terrain.joinToString(",")}],
                    |"objects1":[${vp.objects1.joinToString(",")}]}
                    |""".trimMargin()
                )
        }

        router.get("/tiles").handler { req ->

            val data = lands.tiles
                .filterNotNull()
                .map { JsonObject().put("id", it.id).put("type", it.type) }
                .toJson()

            req.response().putHeader("content-type", "application/json; charset=utf-8")
            req.response().end(
                JsonObject()
                    .put("columns", 23)
                    .put("height", 32)
                    .put("data", data)
                    .toString()
            )
        }

        server.requestHandler(router::accept)
    }

    private fun initCors(router: Router) {
        val cors = CorsHandler.create("*")
        cors.allowedMethod(HttpMethod.GET)
        val headers = HashSet<String>()
        headers.add("content-type")
        headers.add("origin")
        headers.add("content-accept")
        headers.add("x-client-time")
        cors.maxAgeSeconds(600)
        cors.allowedHeaders(headers)
        router.route().handler(cors)
    }

    private fun loadLands(): Lands {
        val rawTiles = JsonObject(App::class.java.getResource("/base1.json").readText())
        val layers = JsonObject(App::class.java.getResource("/map.json").readText())
        return MapParser.parse(layers, rawTiles)
    }
}
