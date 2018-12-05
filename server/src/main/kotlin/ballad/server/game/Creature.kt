package ballad.server.game

import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH
import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.game.actions.Damage

interface Creature {
    val id: Int
    val name: String
    val state: CreatureState
    val x: Int
    val y: Int
    val viewDistance: Int


    fun step(direction: Direction) {
        state.direction = direction

        var xx = 0
        var yy = 0
        when (direction) {
            NORTH -> yy = state.y - 1
            SOUTH -> yy = state.y + 1
            WEST -> xx = state.x - 1
            EAST -> xx = state.x + 1
        }

        if (xx < 0 || yy < 0) {
            println("Ignore step $direction")
        } else {
            xx = x
            yy = y
        }


    }

    fun damage(d: Damage) {
        state.life -= d.amount
        if (state.life < 0) state.life = 0
    }

    val isDead get() = state.life <= 0

}