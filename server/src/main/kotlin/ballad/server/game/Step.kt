package ballad.server.game

import ballad.server.Tsm

data class Step(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val direction: Direction,
    val duration: Duration,
    val creature: Creature
) : Action