package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH
import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.map.TileType
import io.vertx.core.logging.LoggerFactory
import kotlin.random.Random

class NpcStrategy(
    private val npc: Npc,
    private val map: GameMap
) {
    private var nextPlannedTime = -1L

    fun onTick(id: Int, time: Tsm, consumer: ActionConsumer) {
        if (time > nextPlannedTime) {

            val step = passive(time) ?: return

            consumer.add(step)
            nextPlannedTime = time + 1000
        }
    }

    private fun passive(time: Tsm): Step? {

        var dir: Direction
        var attemtps = 0
        do {
            //fixme infinity loop
            dir = Direction.values()[Random.nextInt(0, 4)]
            ++attemtps
        } while (!canStep(dir) && attemtps < 5)

        if (attemtps >= 5) {
            println("Fail get direction" + npc.state)
            return null
        }

        return Step(npc.state.x, npc.state.y, time, dir, 800, npc)
    }


    private fun canStep(dir: Direction): Boolean {

        val x = npc.state.x
        val y = npc.state.y

        return when (dir) {
            NORTH -> canMove(x, y - 1)
            SOUTH -> canMove(x, y + 1)
            WEST -> canMove(x - 1, y)
            EAST -> canMove(x + 1, y)
        }

    }

    private fun canMove(toX: Int, toY: Int): Boolean {

        val tile = map[toX, toY] ?: return false
        return tile.type !== TileType.WALL && tile.type !== TileType.WATER
    }

    companion object {
        val log = LoggerFactory.getLogger(NpcStrategy::class.java)
    }

}