package ballad.server.game

import io.vertx.core.logging.LoggerFactory

class ActionConsumer {
    private val log = LoggerFactory.getLogger(javaClass)
    val data = ArrayList<Action>()

    fun add(action: Action) {
        log.info("New action: {}", action)
        this.data.add(action)

    }
}