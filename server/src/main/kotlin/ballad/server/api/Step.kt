package ballad.server.api

import ballad.server.game.Direction
import ballad.server.game.actions.Step
import kotlinx.serialization.Serializable

@Serializable
data class Step(
    val fromX: Int,
    val fromY: Int,
    val direction: Int,
    val duration: Int,
    val creatureId: Int,
    val time: Long

) {
    constructor(id: Step) : this(

        id.x,
        id.y,
        when (id.direction) {
            Direction.NORTH -> UP
            Direction.SOUTH -> DOWN
            Direction.WEST -> LEFT
            Direction.EAST -> RIGHT
        },
        id.duration,
        id.creature.id,
        0

    )
}