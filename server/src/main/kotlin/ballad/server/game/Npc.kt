package ballad.server.game

import ballad.server.game.Direction.DOWN
import ballad.server.game.Direction.LEFT
import ballad.server.game.Direction.RIGHT
import ballad.server.game.Direction.UP

data class Npc(
    override val id: Int,
    val type: CreatureType,
    val life: Int,
    override val state: CreatureState,
    val threatDistance: Int
) : Creature {


    override val name get() = type.name
    override val x get() = state.x
    override val y get() = state.y


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