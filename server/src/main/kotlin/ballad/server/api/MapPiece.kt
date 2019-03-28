package ballad.server.api

import kotlinx.serialization.Serializable

@Serializable
data class MapPiece(
    val width: Int,
    val heigt: Int,
    val x: Int,
    val y: Int,
    val terrain: ShortArray,
    val objects1: ShortArray
)
