package ballad.server.game

data class Step(
    override val x: Int,
    override val y: Int,
    val direction: Direction,
    val speed: Int,
    val creatureId: Int
) : Action