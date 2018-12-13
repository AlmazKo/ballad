package ballad.server.api

import ballad.server.game.Creature
import ballad.server.game.Player
import kotlinx.serialization.Serializable

@Serializable
data class Creature(
    val id: Int,
    val isPlayer: Boolean,
    val x: Int,
    val y: Int,
    val direction: Int = UP,
    val metrics: NpcMetrics,
    val viewDistance: Int
) {
    constructor(id: Creature) : this(

        id.id,
        id is Player,
        id.x,
        id.y,
        id.state.direction.toDir(),

        // todo id.name
        NpcMetrics(id.id.toString(), id.state.life, id.state.life),
        id.viewDistance
    )
}