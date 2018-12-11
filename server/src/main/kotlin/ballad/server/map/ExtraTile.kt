package ballad.server.map

data class ExtraTile(
    val baseId: Int,
    val baseType: TileType,
    val objectId: Int,
    val objectType: TileType
)