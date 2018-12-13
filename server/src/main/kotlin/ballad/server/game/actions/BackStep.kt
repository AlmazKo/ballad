package ballad.server.game.actions

import ballad.server.Tsm
import ballad.server.game.Creature
import ballad.server.game.Direction
import ballad.server.game.Duration

data class BackStep(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val direction: Direction,
    val duration: Duration,
    val creature: Creature,
    var finished: Boolean = false
) : Action {

    constructor(s: Step, time: Tsm, duration: Duration = s.duration / 2) : this(
        s.x, s.y, time, s.direction, duration, s.creature
    )
}