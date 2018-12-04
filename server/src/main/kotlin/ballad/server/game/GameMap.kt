package ballad.server.game

import ballad.server.game.Direction.SOUTH
import ballad.server.map.Tile
import ballad.server.map.TileType.BRIDGE
import ballad.server.map.TileType.NOTHING
import ballad.server.map.TileType.WALL
import ballad.server.map.TileType.WATER
import io.vertx.core.logging.LoggerFactory

class GameMap(val map: ShortArray, val tiles: Array<Tile>) {
    val npcs = HashMap<Int, Npc>()
    val strategies = ArrayList<NpcStrategy>()
    val players = HashMap<Int, Player>()
    val log = LoggerFactory.getLogger(javaClass)

    private var creaturesInc = 1000
    val spells = ArrayList<Spell>()


    init {
        //        val type = CreatureType(1, "Boar", CreatureResource(1, "", 16, 16, 16, 16))
        //
        //        val npc = Npc(++creaturesInc, type, 50, CreatureState(50, 15, 17, NORTH), 2)
        //        npcs[npc.id] = npc
        //
        //        val npc2 = Npc(++creaturesInc, type, 50, CreatureState(50, 1, 17, NORTH), 2)
        //        npcs[npc2.id] = npc2
        //
        //        strategies.add(NpcStrategy(npc, this))
        //        strategies.add(NpcStrategy(npc2, this))

        debug()
    }

    private fun debug() {
        val sb = StringBuilder()
        map.forEachIndexed { idx, it ->


            if (idx % 32 == 0) {
                sb.append('\n')
            }
            if (it == 0.toShort()) {
                sb.append('.')
            } else {
                val tile: Tile? = tiles[it.toInt()]
                if (tile === null) {
                    sb.append('?')
                    return@forEachIndexed
                }
                val d = when (tile.type) {
                    WATER -> '~'
                    WALL -> '#'
                    BRIDGE -> '='
                    NOTHING -> 'x'
                    else -> 'N'
                }
                sb.append(d)
            }

        }

        println(sb.toString())
    }

    operator fun get(x: Int, y: Int): Tile? {
        val tile = map[x + y * 32]
        return tiles[tile.toInt()]
    }

    fun addPlayer(id: Int): Player {
        val player = Player(id, CreatureState(50, 15, 18, SOUTH))
        players[id] = player
        return player
    }

    fun removePlayer(id: Int) {
        players.remove(id)
    }
}

