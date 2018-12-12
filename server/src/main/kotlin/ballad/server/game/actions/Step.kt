package ballad.server.game.actions

import ballad.server.Tsm
import ballad.server.game.Creature
import ballad.server.game.Direction
import ballad.server.game.Duration

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