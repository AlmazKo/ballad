package ballad.server.game

import ballad.server.Tsm

data class Hide(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val creature: Creature
) : Action {
    constructor(time: Tsm, c: Creature) : this(c.x, c.y, time, c)
}