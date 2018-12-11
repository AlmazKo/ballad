package ballad.server.map

class Lands(
    val width: Int,
    val height: Int,
    val offsetX: Int,
    val offsetY: Int,
    val basis: ShortArray,
    val objects: ShortArray,
    val tiles: Array<Tile>
)