package ballad.server.map

import ballad.server.Position
import ballad.server.Px
import kotlinx.serialization.Serializable

@Serializable
data class TileResource(
    val id: Int,
    val type: TileType,
    val posX: Position,
    val posY: Position,
    val sx: Px,
    val sy: Px
) {
    fun toTile() = Tile(id, type)
}