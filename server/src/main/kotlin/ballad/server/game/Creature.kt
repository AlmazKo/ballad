package ballad.server.game

import ballad.server.game.actions.Action
import ballad.server.game.actions.Damage
import java.util.*

interface Creature {
    val id: Int
    val name: String
    val state: CreatureState
    val x: Int
    val y: Int
    val viewDistance: Int
    val actions: Queue<Action>

    fun startStep(step: Step) {
        state.direction = step.direction
    }

    fun set(posX: Int, posY: Int) {
        state.x = posX
        state.y = posY
    }

    fun damage(d: Damage) {
        state.life -= d.amount
        if (state.life < 0) state.life = 0
    }



    val isDead get() = state.life <= 0

}