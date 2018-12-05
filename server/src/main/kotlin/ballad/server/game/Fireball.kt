package ballad.server.game

import ballad.server.Tsm

data class Fireball(
    override val id: Long,
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val direction: Direction,
    val distance: Int,
    val speed: Duration,
    val creature: Creature,
    var startTime: Tsm = 0,
    override var finished: Boolean = false
) : Action, Spell {
}