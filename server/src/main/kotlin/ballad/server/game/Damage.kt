package ballad.server.game

import ballad.server.Tsm

data class Damage(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val victim: Creature,
    val culprit: Creature,
    var amount: Int = 0
) : Action 