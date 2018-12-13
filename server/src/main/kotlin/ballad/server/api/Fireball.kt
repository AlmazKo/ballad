package ballad.server.api

import ballad.server.game.Direction
import ballad.server.game.actions.Fireball
import kotlinx.serialization.Serializable

@Serializable
data class Fireball(
    val x: Int,
    val y: Int,
    val direction: Int,
    val distance: Int,
    val duration: Int,
    val creatureId: Int,
    val time: Long

) {
    constructor(f: Fireball) : this(f.x, f.y, f.direction.toDir(), f.distance, f.speed, f.source.id, f.time)
}