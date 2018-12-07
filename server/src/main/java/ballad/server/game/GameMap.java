package ballad.server.game;

import ballad.server.game.actions.SpellAction;
import ballad.server.map.Coord;
import ballad.server.map.Tile;
import ballad.server.map.TileType;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.HashMap;

public final class GameMap {
    private final short[] map;
    private final Tile[]  tiles;
    public final  int[]   creatures;


    final HashMap<Integer, Npc>    npcs       = new HashMap<>();
    final ArrayList<NpcStrategy>   strategies = new ArrayList<>();
    final ArrayList<SpellAction>   spells     = new ArrayList<>();
    final ArrayList<Step>          steps      = new ArrayList<>();
    final HashMap<Integer, Player> players    = new HashMap<>();

    private final static int SIZE = 32;

    public GameMap(short[] map, Tile[] tiles) {
        this.map = map;
        this.tiles = tiles;
        this.creatures = new int[map.length];

        settleMobs();
        debug();
    }

    private void settleMobs() {
        CreatureType type = new CreatureType(1, "Boar", new CreatureResource(1, "", 16, 16, 16, 16));
        for (int i = 0; i < 40; i++) {
            strategies.add(new NpcStrategy(type, this));
        }
    }

    private void debug() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < map.length; i++) {

            short it = map[i];
            if (i % SIZE == 0) {
                sb.append('\n');
                sb.append(String.format("%1$-4s", i / SIZE));
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
                    case GRASS:
                        b = '_';
                        break;
                    case WALL:
                        b = '#';
                        break;
                    case BRIDGE:
                        b = '=';
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

    public boolean canMove(int x, int y) {

        Tile tile = get(x, y);
        if (tile != null) {
            if (tile.getType() != TileType.WALL && tile.getType() != TileType.WATER) {
                return isNoCreatures(x, y);
            }
        }

        return false;
    }

    public Player addPlayer(int id) {

        int idx = findFreeIndex(2, 15, 3);
        if (idx == -1) throw new RuntimeException("Not found the place for player");

        Player player = new Player(id, new CreatureState(50, idx % SIZE, idx / SIZE, Direction.SOUTH));

        creatures[idx] = id;
        players.put(id, player);
        return player;
    }

    public void removePlayer(int id) {
        Player removed = players.remove(id);

        if (removed != null) {
            int inMap = creatures[getIndex(removed.getX(), removed.getY())];
            if (inMap != id) {
                throw new RuntimeException("Wrong place player=" + id);
            } else {
                creatures[id] = 0;
            }

        }
    }

    @Nullable public Tile get(int x, int y) {
        int idx = getIndex(x, y);
        if (idx < 0 || idx >= map.length) return null;

        return tiles[map[idx]];
    }

    @Nullable Creature getCreature(int x, int y) {
        if (!isValid(x, y)) return null;

        int crId = creatures[getIndex(x, y)];
        if (crId == 0) return null;
        return npcs.get(crId);
    }

    boolean addCreature(Creature c) {
        int idx = getIndex(c.getX(), c.getY());
        if (idx < 0 || idx >= map.length) return false;

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

        return creatures[getIndex(x, y)] == 0;
    }

    public void moveCreatures(int fromX, int fromY, int toX, int toY) {
        //        if (!isValid(x, y)) return false;
        //todo add validation

        int from = getIndex(fromX, fromY);
        int to = getIndex(toX, toY);
        creatures[to] = creatures[from];
        creatures[from] = 0;
    }

    public @Nullable Coord findFreePlace(int x, int y, int maxDev) {
        int idx = findFreeIndex(x, y, maxDev);
        if (idx == -1) {
            return null;
        } else {
            return new Coord(idx % SIZE, idx / SIZE);
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

        if (creatures[getIndex(x, y)] == 0) return getIndex(x, y);

        for (int i = 1; i <= maxDev; i++) {

            if (i % 2 == 1) {
                for (int s = 0; s < i; s++) {
                    x++;
                    if (isValid(x, y) && creatures[getIndex(x, y)] == 0) return getIndex(x, y);
                }

                for (int s = 0; s < i; s++) {
                    y++;
                    if (isValid(x, y) && creatures[getIndex(x, y)] == 0) return getIndex(x, y);
                }
            } else {
                for (int s = 0; s < i; s++) {
                    x--;
                    if (isValid(x, y) && creatures[getIndex(x, y)] == 0) return getIndex(x, y);
                }

                for (int s = 0; s < i; s++) {
                    y--;
                    if (isValid(x, y) && creatures[getIndex(x, y)] == 0) return getIndex(x, y);
                }
            }
        }

        return -1;
    }


    private static int getIndex(int x, int y) {
        return x + y * SIZE;
    }


    public String debugCreatures() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < creatures.length; i++) {

            int it = creatures[i];
            if (i % SIZE == 0) {
                sb.append('\n');
                sb.append(String.format("%1$-4s", i / SIZE));
            }

            if (it == 0) {
                sb.append('.');
            } else {
                sb.append('c');
            }

        }

        return sb.toString();
    }


    @Contract(pure = true) private static boolean isValid(int x, int y) {
        return x < SIZE && x >= 0 && y <= SIZE && y >= 0;
    }

    @Override public String toString() {
        return debugCreatures();
    }

    public void cleanDeadCreatures() {
        npcs.values().removeIf(n -> {
            if (n.isDead()) {

                this.creatures[getIndex(n.getX(), n.getY())] = 0;
                return true;
            }

            return false;
        });
    }
}
