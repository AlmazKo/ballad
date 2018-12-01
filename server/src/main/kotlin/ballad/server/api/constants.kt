package ballad.server.api

import ballad.server.game.Direction

const val UP = 1
const val DOWN = 2
const val LEFT = 3
const val RIGHT = 4

val mapToDirection = mapOf(
    UP to Direction.NORTH,
    DOWN to Direction.SOUTH,
    LEFT to Direction.WEST,
    RIGHT to Direction.EAST
)