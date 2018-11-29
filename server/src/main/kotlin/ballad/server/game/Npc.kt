package ballad.server.game

import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH

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
            NORTH -> state.y--
            SOUTH -> state.y++
            WEST -> state.x--
            EAST -> state.x++
        }
    }
}