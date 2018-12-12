package ballad.server.game.actions

import ballad.server.Tsm
import ballad.server.game.Creature

data class ReSpawn(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val creature: Creature
) : Action {
    constructor(time: Tsm, c: Creature) : this(c.x, c.y, time, c)
}