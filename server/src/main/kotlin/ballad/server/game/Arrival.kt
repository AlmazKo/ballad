package ballad.server.game

data class Arrival(
    override val x: Int,
    override val y: Int,
    val creature: Creature
) : Action