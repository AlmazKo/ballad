package ballad.server.game

import ballad.server.game.actions.SpellAction

data class Player(
    override val id: Int,
    override val state: CreatureState
) : Creature {
    val zone = HashMap<Int, Creature>()
    val spellZone = HashMap<Long, SpellAction>()

    override val name get() = "Player_$id"
    override val x get() = state.x
    override val y get() = state.y

    override val viewDistance: Int = 8
}