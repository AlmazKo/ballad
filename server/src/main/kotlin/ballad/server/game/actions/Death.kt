package ballad.server.game.actions

import ballad.server.Tsm
import ballad.server.game.Creature

data class Death(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val victim: Creature,
    val culprit: Creature
) : Action {
    constructor(d: Damage) : this(d.x, d.y, d.time, d.victim, d.culprit)
}