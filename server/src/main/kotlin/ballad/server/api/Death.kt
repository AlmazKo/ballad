package ballad.server.api

import kotlinx.serialization.Serializable

@Serializable
data class Death(
    val x: Int,
    val y: Int,
    val culpritId: Int,
    val victimId: Int,
    val time: Long

) {
    constructor(d: ballad.server.game.Death) : this(d.x, d.y, d.culprit.id, d.victim.id, d.time)
}