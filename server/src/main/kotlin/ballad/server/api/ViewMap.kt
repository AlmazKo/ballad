package ballad.server.api

import kotlinx.serialization.Serializable

@Serializable
data class ViewMap(
    val width: Int,
    val heigt: Int,
    val offsetX: Int,
    val offsetY: Int,
    val terrain: ShortArray,
    val objects1: ShortArray
)