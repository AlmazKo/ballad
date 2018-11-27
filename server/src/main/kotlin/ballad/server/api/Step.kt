package ballad.server.api

import ballad.server.game.Direction
import kotlinx.serialization.Serializable

@Serializable
data class Step(
    val fromX: Int,
    val fromY: Int,
    val direction: Direction,
    val speed: Int,
    val creatureId: Long,
    val time: Long

)