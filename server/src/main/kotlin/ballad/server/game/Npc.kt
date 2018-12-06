package ballad.server.game

import ballad.server.game.actions.Action
import java.util.*

data class Npc(
    override val id: Int,
    val type: CreatureType,
    val life: Int,
    override val state: CreatureState,
    override val viewDistance: Int
) : Creature {

    override val actions = ArrayDeque<Action>()
    override val name get() = type.name
    override val x get() = state.x
    override val y get() = state.y
}