package ballad.server.api

import ballad.server.game.Arrival
import ballad.server.game.Direction
import kotlinx.serialization.Serializable

@Serializable
data class Npc(
    val id: Int,
    val x: Int,
    val y: Int,
    val direction: Int = UP,
    val metrics: NpcMetrics
) {
    constructor(id: Arrival) : this(

        id.creature.id,
        id.creature.x,
        id.creature.y,
        when(id.creature.state.direction){
            Direction.NORTH -> UP
            Direction.SOUTH -> DOWN
            Direction.WEST -> LEFT
            Direction.EAST -> RIGHT
        },
        NpcMetrics(id.creature.name, id.creature.state.life, id.creature.state.life)
    )
}