package ballad.server.map

import ballad.server.map.TileType.GATE
import ballad.server.map.TileType.LAND
import ballad.server.map.TileType.NOTHING
import ballad.server.map.TileType.WALL
import ballad.server.map.TileType.WATER
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject

object MapParser {

    private const val chunkSize = 16;

    class Spec(
        val width: Int,
        val height: Int,
        val shiftX: Int,
        val shiftY: Int
    )


    fun parse(rawMap: JsonObject, rawTiles: JsonObject): Lands {

        val layers = rawMap.getJsonArray("layers")
        val spec = calcSpec(layers)
        val map = readChunks(layers.getJsonObject(0).getJsonArray("chunks"), spec)
        val objects = readChunks(layers.getJsonObject(1).getJsonArray("chunks"), spec)
        val tiles = readTiles(rawTiles)

        return Lands(spec.width, spec.height, spec.shiftX, spec.shiftY, map, objects, tiles)
    }

    private fun readTiles(rawTiles: JsonObject): Array<Tile> {
        val tilesColumns = rawTiles.getInteger("columns")!!
        val tileSize = rawTiles.getInteger("tileheight")!!
        val count = rawTiles.getInteger("tilecount")!!
        val tiles = arrayOfNulls<Tile>(count) as Array<Tile>
        rawTiles.getJsonArray("tiles").forEach { it ->
            val tile = it as JsonObject
            val id = tile.getInteger("id")!!
            val rawType = tile.getString("type")

            val type = parseTileType(rawType)

            tiles[id] = Tile(id, type)
        }

        return tiles
    }

    private fun calcSpec(rawLayers: JsonArray): Spec {

        var isFirst = true
        var maxShiftX = 0
        var maxShiftY = 0
        var minShiftX = 0
        var minShiftY = 0

        val basis = rawLayers.getJsonObject(0).getJsonArray("chunks")

        basis.forEach { it ->

            val chunk = it as JsonObject
            val shiftX = chunk.getInteger("x")!!
            val shiftY = chunk.getInteger("y")!!
            if (isFirst) {
                isFirst = false
                minShiftX = shiftX
                minShiftY = shiftY
            }

            if (shiftX > maxShiftX) maxShiftX = shiftX
            if (shiftY > maxShiftY) maxShiftY = shiftY
        }
        val width = maxShiftX - minShiftX + chunkSize
        val height = maxShiftY - minShiftY + chunkSize

        return Spec(width, height, minShiftX, minShiftY)
    }

    private fun readChunks(layers: JsonArray, spec: Spec): ShortArray {
        val map = ShortArray(spec.width * spec.height)


        layers.forEach { it ->

            val chunk = it as JsonObject
            val shiftX = chunk.getInteger("x")!!
            val shiftY = chunk.getInteger("y")!!

            val chunkWidth = chunk.getInteger("width")!!
            val chunkHeight = chunk.getInteger("height")!!

            //fix me positive
            val posX = shiftX - spec.shiftX
            val posY = shiftY - spec.shiftY
            val data = chunk.getJsonArray("data")

            for (i in 0 until data.size()) {

                val v = data.getInteger(i)!!
                if (v == 0) continue

                val chnukX = i % chunkWidth
                val chnukY = i / chunkHeight
                val coord = posX + chnukX + (posY + chnukY) * spec.width
                map[coord] = (v - 1).toShort() //tile manager increments every tile id (I don't know why)
            }

        }
        return map
    }


    private fun parseTileType(raw: String?): TileType {
        if (raw == null) return NOTHING

        return when (raw.toLowerCase()) {
            "land" -> LAND
            "wall" -> WALL
            "gate" -> GATE
            "water" -> WATER
            else -> NOTHING
        }
    }
}