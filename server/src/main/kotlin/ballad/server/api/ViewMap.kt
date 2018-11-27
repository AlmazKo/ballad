package ballad.server.api

import kotlinx.serialization.Serializable

@Serializable
data class ViewMap(
    val x: Int,
    val y: Int,
    val chunk: ShortArray
)