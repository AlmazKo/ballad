package ballad.server.api

import ballad.server.game.Direction
import ballad.server.game.actions.Step


fun Direction.toDir(): Int {
    return when (this) {
        Direction.NORTH -> UP
        Direction.SOUTH -> DOWN
        Direction.WEST -> LEFT
        Direction.EAST -> RIGHT
    }
}