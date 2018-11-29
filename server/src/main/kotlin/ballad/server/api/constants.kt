package ballad.server.api

import ballad.server.game.Direction

const val UP = 38
const val DOWN = 40
const val LEFT = 37
const val RIGHT = 39

val mapToDirection = mapOf(
    UP to Direction.NORTH,
    DOWN to Direction.SOUTH,
    LEFT to Direction.WEST,
    RIGHT to Direction.EAST
)