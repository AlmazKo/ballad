package ballad.server.game

interface Creature {
    val id: Int
    val name: String
    val state: CreatureState
    val x: Int
    val y: Int


    fun step(direction: Direction) {
        state.direction = direction

        when (direction) {
            Direction.NORTH -> state.y--
            Direction.SOUTH -> state.y++
            Direction.WEST -> state.x--
            Direction.EAST -> state.x++
        }
    }

    fun damage(d: Damage) {
        state.life -= d.amount
        if (state.life < 0) state.life = 0
    }

}