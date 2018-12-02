package ballad.server.map;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.jetbrains.annotations.Nullable;

public class Lands {
    public final static int     WIDTH  = 32;
    public final static int     HEIGHT = 32;
    public final        short[] map;
    public final        short[] mapObjects;
    public final        Tile[]  tiles;

    public Lands(short[] map, short[] mapObjects, Tile[] tilesResources) {
        this.map = map;
        this.mapObjects = mapObjects;
        this.tiles = tilesResources;
    }

    public static Lands parse(
            JsonObject rawMap,
            JsonObject rawTiles) {
        short[] map = new short[WIDTH * HEIGHT];
        short[] mapObjects = new short[WIDTH * HEIGHT];

        rawMap.getJsonArray("layers").getJsonObject(0).getJsonArray("chunks").forEach(it -> {

            JsonObject chunk = (JsonObject) it;
            int shiftX = chunk.getInteger("x");
            int shiftY = chunk.getInteger("y");

            int width = chunk.getInteger("width");
            int height = chunk.getInteger("height");

            int posX = 16 + shiftX;
            int posY = 16 + shiftY;

            JsonArray data = chunk.getJsonArray("data");

            for (int i = 0; i < data.size(); i++) {

                int v = data.getInteger(i);
                if (v == 0) continue;

                int chnukX = i % width;
                int chnukY = i / height;
                int coord = posX + chnukX + (posY + chnukY) * WIDTH;
                map[coord] = (short) (v - 1); //tile manager increments every tile id (I don't know why)
            }

        });

        rawMap.getJsonArray("layers").getJsonObject(1).getJsonArray("chunks").forEach(it -> {

            JsonObject chunk = (JsonObject) it;
            int shiftX = chunk.getInteger("x");
            int shiftY = chunk.getInteger("y");

            int width = chunk.getInteger("width");
            int height = chunk.getInteger("height");

            int posX = 16 + shiftX;
            int posY = 16 + shiftY;

            JsonArray data = chunk.getJsonArray("data");

            for (int i = 0; i < data.size(); i++) {

                int v = data.getInteger(i);
                if (v == 0) continue;

                int chnukX = i % width;
                int chnukY = i / height;
                int coord = posX + chnukX + (posY + chnukY) * WIDTH;
                mapObjects[coord] = (short) (v - 1); //tile manager increments every tile id (I don't know why)
            }

        });


        int tilesColumns = rawTiles.getInteger("columns");
        int tileSize = rawTiles.getInteger("tileheight");
        int count = rawTiles.getInteger("tilecount");
        Tile[] tiles = new Tile[count];
        rawTiles.getJsonArray("tiles").forEach(it -> {
            JsonObject tile = (JsonObject) it;
            int id = tile.getInteger("id");
            String rawType = tile.getString("type");

            int t = id;

            TileType type = parseTileType(rawType);

            tiles[t] = new Tile(id, type);
        });


        return new Lands(map, mapObjects, tiles);
    }

    private static TileType parseTileType(@Nullable String raw) {
        if (raw == null) return TileType.NOTHING;

        switch (raw.toLowerCase()) {
            case "water":
                return TileType.WATER;
            case "wall":
                return TileType.WALL;
            default:
                return TileType.NOTHING;

        }
    }
}
