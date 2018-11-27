package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.Direction.DOWN
import ballad.server.game.Direction.LEFT
import ballad.server.game.Direction.RIGHT
import ballad.server.game.Direction.UP
import ballad.server.map.TileType
import kotlin.random.Random

class NpcStrategy(
    private val npc: Npc,
    private val map: GameMap
) {
    private var nextPlannedTime = -1L

    fun onTick(id: Int, time: Tsm, consumer: ActionConsumer) {
        if (time > nextPlannedTime) {

            val step = passive() ?: return

            consumer.add(step)
            nextPlannedTime = time + 400
        }
    }

    private fun passive(): Step? {

        var dir: Direction
        var attemtps = 0
        do {
            //fixme infinity loop
            dir = Direction.values()[Random.nextInt(0, 3)]
            ++attemtps
        } while (!canStep(dir) && attemtps < 5)

        if (attemtps >= 5) {
            println("Fail get direction" + npc.state)
            return null
        }

        npc.step(dir)
        return Step(npc.state.x, npc.state.y, dir, 300, npc.id)
    }


    private fun canStep(dir: Direction): Boolean {

        val x = npc.state.x
        val y = npc.state.y

        return when (dir) {
            UP -> canMove(x, y - 1)
            DOWN -> canMove(x, y + 1)
            LEFT -> canMove(x - 1, y)
            RIGHT -> canMove(x + 1, y)
        }

    }

    private fun canMove(toX: Int, toY: Int): Boolean {

        val tile = map[toX, toY] ?: return false

        return tile.type !== TileType.WALL && tile.type !== TileType.WATER

    }

}