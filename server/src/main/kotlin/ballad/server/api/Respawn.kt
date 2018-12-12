package ballad.server.api

import ballad.server.game.actions.ReSpawn
import ballad.server.tsm
import kotlinx.serialization.Serializable

@Serializable
data class Respawn(
    val creature: Creature,
    val time: Long
) {
    constructor(id: ReSpawn) : this(Creature(id.creature), tsm())
}