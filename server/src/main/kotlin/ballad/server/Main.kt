package ballad.server

import ballad.server.api.App
import io.vertx.core.Vertx

class Main {

    companion object {
        @JvmStatic
        fun main(vararg args: String) {

            System.setProperty("vertx.logger-delegate-factory-class-name", "io.vertx.core.logging.Log4j2LogDelegateFactory")
            System.setProperty("user.timezone", "UTC")
            App(Vertx.vertx())

        }
    }
}