package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.Direction.NORTH
import kotlin.random.Random

class ReSpawnStrategy(
    private val type: CreatureType,
    private val map: GameMap
) {


    private var isDead = false
    private var live: NpcStrategy? = null
    private var respawnTime = Long.MAX_VALUE

    fun onTick(id: Int, time: Tsm, consumer: ActionConsumer) {

        val lv = if (live == null) {
            if (isDead && time < respawnTime) {
                return
            }
            isDead = false


            val (x, y) = map.findFreePlace(14, -12, 4) ?: return
            val npc = Npc(++creaturesInc, type, 50, CreatureState(50, x, y, NORTH), 2)
            map.addCreature(npc)
            live = NpcStrategy(npc, map)
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