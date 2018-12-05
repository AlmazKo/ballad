package ballad.server.game.actions

import ballad.server.Tsm
import ballad.server.game.Creature

data class Damage(
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val victim: Creature,
    val culprit: Creature,
    var amount: Int = 0
) : Action