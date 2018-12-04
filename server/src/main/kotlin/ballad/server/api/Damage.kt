package ballad.server.api

import kotlinx.serialization.Serializable

@Serializable
data class Damage(
    val x: Int,
    val y: Int,
    val culpritId: Int,
    val victimId: Int,
    val amount: Int,
    val time: Long

) {
    constructor(d: ballad.server.game.Damage) : this(d.x, d.y, d.culprit.id, d.victim.id, d.amount, d.time)
}