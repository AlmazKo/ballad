package ballad.server.game

import ballad.server.Tsm

data class Arrival(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val creature: Creature
) : Action