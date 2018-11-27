package ballad.server.game

import ballad.server.api.Step
import ballad.server.tsm
import io.vertx.core.Vertx

class NpcStrategy(
    private val vertx: Vertx,
    private val npc: Npc,
    private val map: GameMap,
    private val actionsStream: Any
) {


    fun passive() {
        vertx.setPeriodic(400) {
            val dir = Direction.DOWN
            npc.step(dir)
            Step(npc.state.x, npc.state.y, dir, 300, npc.id, tsm())
        }
    }


}