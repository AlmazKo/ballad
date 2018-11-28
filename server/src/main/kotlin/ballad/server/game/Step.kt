package ballad.server.game

data class Step(
    val fromX: Int,
    val fromY: Int,
    val direction: Direction,
    val speed: Int,
    val creatureId: Int
) : Action