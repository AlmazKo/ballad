package ballad.server.game

import ballad.server.game.Direction.DOWN
import ballad.server.game.Direction.LEFT
import ballad.server.game.Direction.RIGHT
import ballad.server.game.Direction.UP

open class Npc(
    override val id: Long,
    override val type: CreatureType,
    override val life: Int,
    val state: NpcState,
    val threatDistance: Int
) : Creature {

    fun step(direction: Direction) {
        state.direction = direction

        when (direction) {
            UP -> state.y++
            DOWN -> state.y--
            LEFT -> state.x--
            RIGHT -> state.x++
        }
    }
}