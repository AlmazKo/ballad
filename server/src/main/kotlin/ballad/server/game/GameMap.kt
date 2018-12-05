package ballad.server.game

import ballad.server.game.Direction.SOUTH
import ballad.server.game.actions.SpellAction
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


    val spells = ArrayList<SpellAction>()


    init {
        val type = CreatureType(1, "Boar", CreatureResource(1, "", 16, 16, 16, 16))


        repeat(500) {
            strategies.add(NpcStrategy(type, this))
        }

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
        val idx = x + y * 32
        if (idx < 0 || idx >= map.size) return null

        val tile = map[idx]
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

