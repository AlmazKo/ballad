package ballad.server.api

import ballad.server.game.Arrival
import ballad.server.game.Damage
import ballad.server.game.Death
import ballad.server.game.Fireball
import ballad.server.game.Game
import ballad.server.game.GameMap
import ballad.server.game.Hide
import ballad.server.game.Step
import ballad.server.map.Lands
import ballad.server.toJson
import ballad.server.tsm
import io.vertx.core.Vertx
import io.vertx.core.http.HttpMethod
import io.vertx.core.http.HttpServer
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.CorsHandler
import io.vertx.ext.web.handler.StaticHandler
import kotlinx.serialization.json.JSON
import java.util.*
import java.util.concurrent.atomic.AtomicInteger

class App(vertx: Vertx) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val playerInc = AtomicInteger(0)

    init {
        val lands = loadLands()
        val map = GameMap(lands.map, lands.tiles)
        val game = Game(vertx, map)
        val server = vertx.createHttpServer()

        initApi(vertx, lands, server)
        initWsApi(server, map, game)

        server.listen {
            log.info("Started!")
        }
    }

    private fun initWsApi(server: HttpServer, map: GameMap, game: Game) {
        server.websocketHandler { ws ->
            val id = playerInc.incrementAndGet()
            log.info("Connected player: #$id")

            val p = map.addPlayer(id)

            val arr = ballad.server.game.Arrival(p.x, p.y, tsm(), p)
            game.send(arr)


            val act = JSON.stringify(ballad.server.api.Arrival.serializer(), ballad.server.api.Arrival(arr))
            ws.writeFinalTextFrame("""{"action":"PROTAGONIST_ARRIVAL", "data": $act}""")
            ws.closeHandler {
                game.send(Hide(tsm(), p))
                map.removePlayer(id)
                log.info("Connection is closed: $id")
            }

            ws.textMessageHandler { msg ->
                val raw = JsonObject(msg)
                val data = raw.getJsonObject("data")
                val act = when (raw.getString("action")) {
                    "STEP" -> {
                        Step(
                            x = data.getInteger("x"),
                            y = data.getInteger("y"),
                            time = tsm(), //fixme
                            creature = p,
                            duration = 300,
                            direction = mapToDirection[data.getInteger("direction")]!!
                        )
                    }
                    "SPELL" -> {
                        Fireball(
                            x = data.getInteger("x"),
                            y = data.getInteger("y"),
                            time = tsm(), //fixme
                            distance = data.getInteger("distance"),
                            speed = data.getInteger("speed"),
                            creature = p,
                            direction = mapToDirection[data.getInteger("direction")]!!
                        )
                    }
                    else -> return@textMessageHandler
                }

                game.send(act)
            }

            game.subscribe(id) { actions ->
                actions.forEach {
                    val act = when (it) {
                        is Hide -> JSON.stringify(ballad.server.api.Hide.serializer(), ballad.server.api.Hide(it))
                        is Arrival -> JSON.stringify(ballad.server.api.Arrival.serializer(), ballad.server.api.Arrival(it))
                        is Step -> JSON.stringify(ballad.server.api.Step.serializer(), ballad.server.api.Step(it))
                        is Damage -> JSON.stringify(ballad.server.api.Damage.serializer(), ballad.server.api.Damage(it))
                        is Death -> JSON.stringify(ballad.server.api.Death.serializer(), ballad.server.api.Death(it))
                        else -> return@forEach
                    }
                    ws.writeFinalTextFrame("""{"action":"${it.javaClass.simpleName.toUpperCase()}", "data": $act}""")
                }
            }
        }
    }

    private fun initApi(vertx: Vertx, lands: Lands, server: HttpServer) {
        val router = Router.router(vertx)
        initCors(router)

        router.route("/res/*").handler(StaticHandler.create("../resources"))

        router.get("/map").handler { req ->
            val vp = ViewMap(0, 0, lands.map)
            val vp2 = ViewMap(0, 0, lands.mapObjects)
            req.response().putHeader("content-type", "application/json; charset=utf-8")
            req.response()
                .end("""{"x":${vp.x}, "y":${vp.y}, "terrain":[${vp.chunk.joinToString(",")}], "objects1":[${vp2.chunk.joinToString(",")}]}""")
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
        val rawTiles = JsonObject(Lands::class.java.getResource("/tileset.json").readText())
        val layers = JsonObject(Lands::class.java.getResource("/map.json").readText())
        return Lands.parse(layers, rawTiles)
    }
}
