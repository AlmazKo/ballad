package ballad.server.api

import ballad.server.game.Direction
import ballad.server.game.actions.BackStep
import kotlinx.serialization.Serializable

@Serializable
data class BackStep(
    val fromX: Int,
    val fromY: Int,
    val direction: Int,
    val duration: Int,
    val creatureId: Int,
    val time: Long

) {
    constructor(id: BackStep) : this(
        id.x,
        id.y,
        id.direction.toDir(),
        id.duration,
        id.creature.id,
        id.time
    )
}