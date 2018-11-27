package ballad.server.api

import UP
import kotlinx.serialization.Serializable

@Serializable
data class Npc(
    val id: Long,
    val x: Int,
    val y: Int,
    val direction: Int = UP,
    val metrics: NpcMetrics
)