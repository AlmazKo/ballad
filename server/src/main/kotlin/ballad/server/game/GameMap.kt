package ballad.server.game

import ballad.server.map.Tile

class GameMap(val map: ShortArray, val tiles: Array<Tile>) {
    val npcs = HashMap<Long, Npc>()
    val strategies = ArrayList<NpcStrategy>()
    val players = HashMap<Long, Creature>()


    init {
        val type = CreatureType(1, "Boar", CreatureResource(1, "", 16, 16, 16, 16))

        val npc = Npc(2, type, 50, NpcState(true, 50, 15, 25, Direction.UP), 2)
        npcs[1] = npc

        strategies.add(NpcStrategy(npc, this))


        val sb = StringBuilder()
        map.forEachIndexed {idx, it ->
            if (it == 0.toShort()) {
                sb.append('.')
            } else {
                sb.append('X')
            }

            if (idx / 32 * 32 == idx) {
                sb.append('\n')
            }
        }

        println(sb.toString())
    }

    operator fun get(x: Int, y: Int): Tile? {
        val tile = map[x + y * 32]
        return tiles[tile.toInt()]
    }
}

