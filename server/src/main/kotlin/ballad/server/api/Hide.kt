package ballad.server.api

import ballad.server.game.Hide
import ballad.server.tsm
import kotlinx.serialization.Serializable

@Serializable
data class Hide(
    val creatureId: Int,
    val time: Long
) {
    constructor(action: Hide) : this(action.creature.id, tsm())
}