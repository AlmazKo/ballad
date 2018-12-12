package ballad.server.game.spells

import ballad.server.Tsm
import ballad.server.game.ActionConsumer
import ballad.server.game.Creature
import ballad.server.game.GameMap
import ballad.server.game.actions.SpellAction

interface SpellStrategy {
    val action: SpellAction
    val id get() = action.id
    fun inZone(creature: Creature): Boolean
    fun handle(time: Tsm, actions: ActionConsumer, map: GameMap): Boolean
}