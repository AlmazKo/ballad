package ballad.server.game

import ballad.server.map.Tile
import ballad.server.map.TileType.BRIDGE
import ballad.server.map.TileType.NOTHING
import ballad.server.map.TileType.WALL
import ballad.server.map.TileType.WATER

class GameMap(val map: ShortArray, val tiles: Array<Tile>) {
    val npcs = HashMap<Long, Npc>()
    val strategies = ArrayList<NpcStrategy>()
    val players = HashMap<Long, Creature>()


    init {
        val type = CreatureType(1, "Boar", CreatureResource(1, "", 16, 16, 16, 16))

        val npc = Npc(2, type, 50, NpcState(true, 50, 15, 17, Direction.UP), 2)
        npcs[1] = npc

        strategies.add(NpcStrategy(npc, this))


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
}

