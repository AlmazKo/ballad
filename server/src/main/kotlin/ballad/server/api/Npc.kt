package ballad.server.api

import DOWN
import LEFT
import RIGHT
import UP
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
            Direction.UP -> UP
            Direction.DOWN -> DOWN
            Direction.LEFT -> LEFT
            Direction.RIGHT -> RIGHT
        },
        NpcMetrics(id.creature.name, id.creature.state.life, id.creature.state.life)
    )
}