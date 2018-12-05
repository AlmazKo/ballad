package ballad.server.api

import ballad.server.game.actions.Fireball
import kotlinx.serialization.Serializable

@Serializable
data class Fireball(
    val x: Int,
    val y: Int,
    val creatureId: Int,
    val time: Long

) {
    constructor(f: Fireball) : this(f.x, f.y, f.source.id, f.time)
}