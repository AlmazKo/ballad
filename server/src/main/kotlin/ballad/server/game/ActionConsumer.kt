package ballad.server.game

import io.vertx.core.logging.LoggerFactory

class ActionConsumer {
    private val log = LoggerFactory.getLogger(javaClass)
    fun add(action: Action) {

        log.info("New action: {}", action)

    }
}