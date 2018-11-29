package ballad.server.api

import ballad.server.game.Creature
import ballad.server.game.Direction
import kotlinx.serialization.Serializable

@Serializable
data class Creature(
    val id: Int,
    val x: Int,
    val y: Int,
    val direction: Int = UP,
    val metrics: NpcMetrics
) {
    constructor(id: Creature) : this(

        id.id,
        id.x,
        id.y,
        when (id.state.direction) {
            Direction.NORTH -> UP
            Direction.SOUTH -> DOWN
            Direction.WEST -> LEFT
            Direction.EAST -> RIGHT
        },
        NpcMetrics(id.name, id.state.life, id.state.life)
    )
}