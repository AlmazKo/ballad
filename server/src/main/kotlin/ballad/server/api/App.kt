package ballad.server.api

import ballad.server.game.ActionType.ARRIVAL
import ballad.server.game.Arrival
import ballad.server.game.Game
import ballad.server.game.GameMap
import ballad.server.map.Lands
import ballad.server.toJson
import io.vertx.core.Vertx
import io.vertx.core.http.HttpMethod
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.CorsHandler
import io.vertx.ext.web.handler.StaticHandler
import kotlinx.serialization.json.JSON
import java.util.*

class App(vertx: Vertx) {
    private val log = LoggerFactory.getLogger(javaClass)

    init {

        val rawTiles = JsonObject(Lands::class.java.getResource("/tileset.json").readText())
        val layers = JsonObject(Lands::class.java.getResource("/map.json").readText())
        val lands = Lands.parse(layers, rawTiles)


        val map = GameMap(lands.map, lands.tiles)
        val game = Game(vertx, map)

        val server = vertx.createHttpServer()


        val router = Router.router(vertx)

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

        router.route("/res/*").handler(StaticHandler.create("../resources"))

        router.get("/map").handler { req ->
            val vp = ViewMap(0, 0, lands.map)
            req.response().putHeader("content-type", "application/json; charset=utf-8")
            req.response().end("""{"x":${vp.x}, "y":${vp.y}, "data":[${vp.chunk.joinToString(",")}]}""")
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
        var ids = 0;

        server.requestHandler(router::accept)

        var fs = vertx.fileSystem()

        //        server.requestHandler { req ->
        //            when (req.path()) {
        //                "/map" -> {
        //                    lands.map
        //                    val vp = ViewMap(0, 0, lands.map)
        //                    req.response().putHeader("content-type", "application/json")
        //
        //                    req.response().end("""{"x":${vp.x}, "y":${vp.y}, chunk:[${vp.chunk.joinToString(",")}]}""")
        //                }
        //
        //                "/tiles" -> {
        //
        //                }
        //                "/tileset" -> {
        //                    req.response().putHeader("content-type", "image/png")
        //
        //                    req.query()
        //                    req.response().end(tileset)
        //                }
        //            }
        //        }

        server.websocketHandler { ws ->
            log.info("Connected!")


            map.addPlayer(1)
            game.subscribe(1) { actions ->


                actions.forEach {
                    val act = when (it) {
                        is Arrival -> Action(ARRIVAL, Npc(it))
                        else -> return@forEach
                    }
                    ws.writeFinalTextFrame(JSON.stringify(Action.serializer(), act))
                }
            }
        }
        server.listen {
            log.info("Started!")
        }
    }

    companion object {
        @JvmStatic
        fun main(vararg args: String) {

            System.setProperty("vertx.logger-delegate-factory-class-name", "io.vertx.core.logging.Log4j2LogDelegateFactory")
            System.setProperty("user.timezone", "UTC")
            App(Vertx.vertx())

        }
    }
}
