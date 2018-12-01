package ballad.server.game

class Player(
    override val id: Int,
    override val state: CreatureState
) : Creature {
    val zone = HashMap<Int, Creature>()

    override val name get() = "Player_$id"
    override val x get() = state.x
    override val y get() = state.y

    val viewDistance = 8
}