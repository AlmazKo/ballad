package ballad.server.game.spells

import ballad.server.Tsm
import ballad.server.game.ActionConsumer
import ballad.server.game.Creature
import ballad.server.game.GameMap
import ballad.server.game.actions.Damage
import ballad.server.game.actions.Death
import ballad.server.game.actions.Fireball

class FireballStrategy(override val action: Fireball) : SpellStrategy {

    override fun inZone(creature: Creature): Boolean {
        return action.inZone(creature.x, creature.y, creature.viewDistance)
    }

    override fun handle(time: Tsm, actions: ActionConsumer, map: GameMap): Boolean {

        val distance = Math.min(action.distance, Math.round((time - action.time) / action.speed.toFloat()))
        action.distanceTravelled = distance

        val x = action.currentX
        val y = action.currentY

        val victim = map.getCreature(x, y)
        if (victim !== null && victim.id != action.source.id) {
            val d = Damage(x, y, time, victim, action.source, 25, action.id)
            victim.damage(d)
            actions.add(d)

            if (victim.state.life == 0) {
                actions.add(Death(d))
            }

            action.finished = true
        }

        if (distance >= action.distance) {
            action.finished = true
        }

        return action.finished
    }

}