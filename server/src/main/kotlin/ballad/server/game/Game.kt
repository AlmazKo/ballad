package ballad.server.game

import ballad.server.tsm
import io.vertx.core.Vertx

class Game(val vertx: Vertx,val map: GameMap) {

    var id = 0;
    init {
        vertx.setPeriodic(250) { onTick() }

    }


    private fun onTick() {

        val actions = ActionConsumer()

        map.strategies.forEach { it.onTick(id++, tsm(),actions) }

    }
}