package ballad.server.api

import ballad.server.game.actions.Arrival
import ballad.server.tsm
import kotlinx.serialization.Serializable

@Serializable
data class Arrival(
    val creature: Creature,
    val time: Long
) {
    constructor(id: Arrival) : this(Creature(id.creature), tsm())
}