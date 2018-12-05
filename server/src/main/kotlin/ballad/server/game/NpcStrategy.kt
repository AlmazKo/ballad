package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH
import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.game.actions.Arrival
import kotlin.random.Random

class NpcStrategy(
    private val type: CreatureType,
    private val map: GameMap
) {


    class Live(private val npc: Npc, private val map: GameMap) {
        private var nextPlannedTime = -1L

        fun isDead() = npc.isDead

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

            return Step(npc.state.x, npc.state.y, time, dir, 300, npc)
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
            return tile.type !== ballad.server.map.TileType.WALL && tile.type !== ballad.server.map.TileType.WATER
        }

        fun onTick(time: Tsm, consumer: ActionConsumer) {
            if (time > nextPlannedTime) {

                val step = passive(time) ?: return

                consumer.add(step)
                nextPlannedTime = time + 500
            }
        }

    }

    private var isDead = false
    private var live: Live? = null
    private var respawnTime = Long.MAX_VALUE

    fun onTick(id: Int, time: Tsm, consumer: ActionConsumer) {

        val lv = if (live == null) {
            if (isDead && time < respawnTime) {
                return
            }
            isDead = false
            val npc = Npc(++creaturesInc, type, 50, CreatureState(50, 15, 17, NORTH), 2)
            consumer.add(Arrival(time, npc))
            live = Live(npc, map)
            live!!
        } else live!!

        if (lv.isDead()) {
            live = null
            isDead = true
            respawnTime = time + 8000
            return
        }

        lv.onTick(time, consumer)
    }


    companion object {
        private var creaturesInc = 1000
    }
}