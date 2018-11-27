package ballad.server.game

class Step(
    val fromX: Int,
    val fromY: Int,
    val direction: Direction,
    val speed: Int,
    val creatureId: Long
) : Action