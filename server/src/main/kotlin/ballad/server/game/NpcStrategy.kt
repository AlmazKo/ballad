package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH
import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.game.actions.Arrival
import ballad.server.map.TileType.WALL
import ballad.server.map.TileType.WATER
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
                //println("Fail get direction" + npc.state)
                return null
            }

            return Step(npc.state.x, npc.state.y, time, dir, 800, npc)
        }


        private fun canStep(dir: Direction): Boolean {

            val x = npc.state.x
            val y = npc.state.y

            return when (dir) {
                NORTH -> map.canMove(x, y - 1)
                SOUTH -> map.canMove(x, y + 1)
                WEST -> map.canMove(x - 1, y)
                EAST -> map.canMove(x + 1, y)
            }

        }


        fun onTick(time: Tsm, consumer: ActionConsumer) {
            if (time > nextPlannedTime) {


                val step = passive(time) ?: return

                consumer.add(step)
                nextPlannedTime = time + Random.nextInt(1000, 2000)
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


            val (x, y) = map.findFreePlace(23, 15, 4) ?: return
            val npc = Npc(++creaturesInc, type, 50, CreatureState(50, x, y, NORTH), 2)
            map.addCreature(npc)
            live = Live(npc, map)
            live!!
        } else live!!

        if (lv.isDead()) {
            live = null
            isDead = true
            respawnTime = time + Random.nextInt(10_000, 60_000)
            return
        }

        lv.onTick(time, consumer)
    }


    companion object {
        private var creaturesInc = 1000
    }
}