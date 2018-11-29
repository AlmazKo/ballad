package ballad.server.game

data class Npc(
    override val id: Int,
    val type: CreatureType,
    val life: Int,
    override val state: CreatureState,
    val threatDistance: Int
) : Creature {


    override val name get() = type.name
    override val x get() = state.x
    override val y get() = state.y
}