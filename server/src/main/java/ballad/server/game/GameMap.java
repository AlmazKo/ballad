package ballad.server.game;

import ballad.server.game.actions.SpellAction;
import ballad.server.map.Coord;
import ballad.server.map.Lands;
import ballad.server.map.Tile;
import ballad.server.map.TileType;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static java.lang.Math.max;
import static java.lang.Math.min;

public final class GameMap {
    private final short[] basis;
    private final short[] objects;
    private final Tile[]  tiles;

    public int[] getCreatures() {
        return creatures;
    }

    private final int[] creatures;
    private final int   width;
    private final int   height;

    private final HashMap<Integer, Npc> npcs = new HashMap<>();

    final         ArrayList<ReSpawnStrategy> strategies = new ArrayList<>();
    final         ArrayList<SpellAction>     spells     = new ArrayList<>();
    final         ArrayList<Step>            steps      = new ArrayList<>();
    final         HashMap<Integer, Player>   players    = new HashMap<>();
    private final int                        offsetX;
    private final int                        offsetY;

    public GameMap(Lands lands) {
        this.offsetX = lands.getOffsetX();
        this.offsetY = lands.getOffsetY();
        this.width = lands.getWidth();
        this.height = lands.getHeight();
        this.basis = lands.getBasis();
        this.objects = lands.getObjects();
        this.creatures = new int[basis.length];
        this.tiles = lands.getTiles();
//        settleMobs();
        debug();
    }

    private void settleMobs() {
        CreatureType type = new CreatureType(1, "Boar", new CreatureResource(1, "", 16, 16, 16, 16));
        for (int i = 0; i < 4; i++) {
            strategies.add(new ReSpawnStrategy(type, this));
        }
    }

    private void debug() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < basis.length; i++) {

            short it = basis[i];
            if (i % width == 0) {
                sb.append('\n');
                sb.append(String.format("%1$-4s", i / width + offsetY));
            }

            if (it == 0) {
                sb.append('.');
            } else {
                Tile tile = tiles[it];
                if (tile == null) {
                    sb.append('?');
                    continue;
                }

                char b;
                switch (tile.getType()) {

                    case WATER:
                        b = '~';
                        break;

                    case LAND:
                        b = '.';
                        break;
                    case WALL:
                        b = '#';
                        break;
                    case GATE:
                        b = 'D';
                        break;
                    case NOTHING:
                        b = 'x';
                        break;

                    default:
                        b = 'N';
                }

                sb.append(b);
            }

        }

        System.out.println(sb.toString());
    }

    public Player addPlayer(int id) {

        int idx = findFreeIndex(-18, 0, 3);
        if (idx == -1) throw new RuntimeException("Not found the place for player");

        Coord coord = toCoord(idx);
        Player player = new Player(id, new CreatureState(50, coord.getX(), coord.getY(), Direction.SOUTH));

        creatures[idx] = id;
        players.put(id, player);
        return player;
    }

    public void removePlayer(int id) {
        Player removed = players.remove(id);

        if (removed != null) {
            int idx = toIndex(removed.getX(), removed.getY());
            int inMap = creatures[idx];
            if (inMap != id) {
                throw new RuntimeException("Wrong place player=" + id);
            } else {
                creatures[idx] = 0;
            }

        }
    }

    @Nullable public Tile get(int x, int y) {
        int idx = toIndex(x, y);
        if (idx < 0 || idx >= basis.length) return null;

        return tiles[basis[idx]];
    }

    @Nullable public Tile getObject(int x, int y) {
        int idx = toIndex(x, y);
        if (idx < 0 || idx >= basis.length) return null;

        return tiles[objects[idx]];
    }

    @Nullable Creature getCreature(int x, int y) {
        if (!isValid(x, y)) return null;

        return _getCreature(x, y);
    }

    @Nullable private Creature _getCreature(int x, int y) {
        int crId = creatures[toIndex(x, y)];
        if (crId > 1000) {
            return npcs.get(crId);
        } else if (crId > 0) {
            return players.get(crId);
        }

        return null;
    }

    List<@NotNull Creature> getCreatures(int centerX, int centerY, int radius) {

        ArrayList<@NotNull Creature> result = new ArrayList<>();

        for (int x = max(offsetX, centerX - radius); x <= min(centerX + radius, width + offsetX); x++) {
            for (int y = max(offsetY, centerY - radius); y <= min(centerY + radius, height + offsetY); y++) {
                if (x == centerX && y == centerY) continue;

                @Nullable Creature cr = _getCreature(x, y);
                if (cr != null) {
                    result.add(cr);
                }
            }
        }

        return result;
    }

    boolean addCreature(Creature c) {
        int idx = toIndex(c.getX(), c.getY());
        if (idx < 0 || idx >= basis.length) return false;

        idx = findFreeIndex(c.getX(), c.getY(), 2);

        if (idx >= 0) {
            creatures[idx] = c.getId();
            if (c instanceof Npc) npcs.put(c.getId(), (Npc) c);
            return true;
        } else {
            return false;
        }
    }


    public boolean isNoCreatures(int x, int y) {
        if (!isValid(x, y)) return false;

        return creatures[toIndex(x, y)] == 0;
    }

    public void moveCreatures(int fromX, int fromY, int toX, int toY) {
        //        if (!isValid(x, y)) return false;
        //todo add validation

        int from = toIndex(fromX, fromY);
        int to = toIndex(toX, toY);
        creatures[to] = creatures[from];
        creatures[from] = 0;
    }

    public @Nullable Coord findFreePlace(int x, int y, int maxDev) {
        int idx = findFreeIndex(x, y, maxDev);
        if (idx == -1) {
            return null;
        } else {
            return toCoord(idx);
        }
    }

    /*
    Search
     xxxxxxx
     x ┏━━┓x
     x ┃╳┓┃x
     x ┗━┛┃x
     x ╍╍━┛x
     */
    private int findFreeIndex(int x, int y, int maxDev) {

        if (!isValid(x, y)) return -1;

        if (creatures[toIndex(x, y)] == 0) return toIndex(x, y);

        for (int i = 1; i <= maxDev; i++) {

            if (i % 2 == 1) {
                for (int s = 0; s < i; s++) {
                    x++;
                    if (isValid(x, y) && creatures[toIndex(x, y)] == 0) return toIndex(x, y);
                }

                for (int s = 0; s < i; s++) {
                    y++;
                    if (isValid(x, y) && creatures[toIndex(x, y)] == 0) return toIndex(x, y);
                }
            } else {
                for (int s = 0; s < i; s++) {
                    x--;
                    if (isValid(x, y) && creatures[toIndex(x, y)] == 0) return toIndex(x, y);
                }

                for (int s = 0; s < i; s++) {
                    y--;
                    if (isValid(x, y) && creatures[toIndex(x, y)] == 0) return toIndex(x, y);
                }
            }
        }

        return -1;
    }

    public String debugCreatures() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < creatures.length; i++) {

            int it = creatures[i];
            if (i % width == 0) {
                sb.append('\n');
                sb.append(String.format("%1$-4s", i / width + offsetY));
            }

            if (it == 0) {
                sb.append('.');
            } else if (it >= 1000) {
                sb.append('c');
            } else {
                sb.append('p');
            }

        }

        return sb.toString();
    }

    @Contract(pure = true) private boolean isValid(int x, int y) {
        return x >= offsetX && x < (offsetX + width) && y >= offsetY && x < (offsetY + height);
    }

    private int toIndex(int x, int y) {
        return x - offsetX + (y - offsetY) * width;
    }

    private Coord toCoord(int idx) {
        return new Coord(idx % width + offsetX, idx / width + offsetY);
    }

    @Override public String toString() {
        return debugCreatures();
    }

    public void cleanDeadCreatures() {
        npcs.values().removeIf(n -> {
            if (n.isDead()) {

                this.creatures[toIndex(n.getX(), n.getY())] = 0;
                return true;
            }

            return false;
        });
    }
}
