package ballad.server.api

import kotlinx.serialization.Serializable

@Serializable
data class NpcMetrics(
    val name: String,
    val life: Int,
    val maxLife: Int
)