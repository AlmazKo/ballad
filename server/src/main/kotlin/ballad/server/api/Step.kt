package ballad.server.api

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
        id.direction.toDir(),
        id.duration,
        id.creature.id,
        id.time
    )

}
