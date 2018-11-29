package ballad.server.api

import ballad.server.game.Direction
import kotlinx.serialization.Serializable

@Serializable
data class Step(
    val fromX: Int,
    val fromY: Int,
    val direction: Int,
    val speed: Int,
    val creatureId: Int,
    val time: Long

) {
    constructor(id: ballad.server.game.Step) : this(

        id.x,
        id.y,
        when (id.direction) {
            Direction.NORTH -> UP
            Direction.SOUTH -> DOWN
            Direction.WEST -> LEFT
            Direction.EAST -> RIGHT
        },
        id.speed,
        id.creatureId,
        0

    )
}