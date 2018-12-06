package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.actions.Action

data class Step(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val direction: Direction,
    val duration: Duration,
    val creature: Creature,
    var distanceTravelled: Int = 0,
    var finished: Boolean = false
) : Action