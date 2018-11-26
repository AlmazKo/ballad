package ballad.server.api

import io.vertx.core.Vertx
import io.vertx.core.logging.LoggerFactory

class App(vertx: Vertx) {
    private val log = LoggerFactory.getLogger(javaClass)

    init {
        val server = vertx.createHttpServer()
        server.websocketHandler { ws ->
            log.info("Connected!")
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
