package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.actions.Action
import ballad.server.game.actions.Arrival
import ballad.server.game.actions.Damage
import ballad.server.game.actions.Death
import ballad.server.game.actions.Fireball
import ballad.server.game.actions.Hide
import ballad.server.game.actions.ReSpawn
import ballad.server.game.actions.Step
import ballad.server.game.spells.FireballStrategy
import ballad.server.game.spells.SpellStrategy
import ballad.server.map.TileType
import ballad.server.tsm
import io.vertx.core.Vertx
import io.vertx.core.logging.LoggerFactory

class Game(vertx: Vertx, val map: GameMap) {

    private val log = LoggerFactory.getLogger(javaClass)

    private val playerHandler = HashMap<Int, (actions: List<Action>) -> Unit>()
    private val playerRequests = ArrayList<Action>()
    private val respawns = ArrayList<PlayerReSpawnStrategy>()
    private val npcRespawns = ArrayList<ReSpawnStrategy>()
    private val spells = ArrayList<SpellStrategy>()
    private val steps = ArrayList<StepStrategy>()

    private var endHandler: (() -> Unit)? = null

    var id = 0

    init {
        vertx.setPeriodic(TICK_TIME.toLong()) { onTick(++id, tsm()) }
        //        settleMobs()
    }

    private fun settleMobs() {
        val type = CreatureType(1, "Boar", CreatureResource(1, "", 16, 16, 16, 16))

        repeat(3) {
            npcRespawns.add(ReSpawnStrategy(type, map))
        }
    }

    private fun onTick(id: Tick, time: Tsm) {
        val actions = ActionConsumer()

        respawns.removeIf { it.onTick(time, actions, map) }

        addRequestedActions(actions, time)

        //players turn
        processSteps(time, actions)
        processSpells(time, actions)

        val playersActions = notifyPlayers(time, actions)

        actions.data.forEach {
            when (it) {
                is Step -> steps.add(StepStrategy(it))
                is Hide -> map.removePlayer(it.creature.id)
                is Death -> {
                    map.removePlayer(it.victim.id)
                    respawns.add(PlayerReSpawnStrategy(it))
                }
            }
        }

        //mobs turn
        npcRespawns.forEach { it.onTick(id, time, actions) }

        map.cleanDeadCreatures()

        //after tick process
        playersActions.forEach { pId, acts ->
            playerHandler[pId]?.invoke(acts)
        }

        endHandler?.invoke()
    }

    private fun notifyPlayers(time: Tsm, actions: ActionConsumer): Map<PlayerId, List<Action>> {

        val playerActions = HashMap<PlayerId, MutableList<Action>>()
        actions.data.forEach { a ->

            map.players.values.forEach { p ->

                val v = p.viewDistance
                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })

                when (a) {
                    is ReSpawn -> if (inZone(a, p, v)) pActions.add(a)
                    is Arrival -> if (inZone(a, p, v)) pActions.add(a)
                    is Step -> if (inZone(a, p, v)) pActions.add(a)
                    is Damage -> if (inZone(a, p, v)) pActions.add(a)
                    is Death -> if (inZone(a, p, v)) pActions.add(a)
                }
            }
        }

        spells.forEach { s ->
            map.players.values.forEach { p ->

                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })
                if (s.inZone(p)) {
                    if (p.spellZone.put(s.id, s) === null) {
                        if (s.action is Fireball) {
                            val a = s.action as Fireball
                            pActions.add(a.copy(x = a.currentX, y = a.currentY, distance = a.distance - a.distanceTravelled))
                        }
                    }
                } else {
                    p.spellZone.remove(s.id)
                }
            }
        }


        map.players.values.forEach { p ->
            val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })
            val zCreatures = map.getCreatures(p.x, p.y, p.viewDistance)
            p.zone.values.removeIf {
                if (!zCreatures.contains(it)) {
                    pActions.add(Hide(it.x, it.y, time, it))
                    true
                } else false
            }

            zCreatures.forEach { n ->
                if (!p.zone.contains(n.id)) {
                    p.zone[n.id] = n
                    pActions.add(Arrival(n.x, n.y, time, n))
                }
            }
        }

        return playerActions
    }

    private fun addRequestedActions(actions: ActionConsumer, time: Tsm) {
        playerRequests.forEach {

            when (it) {
                is Step -> {
                    //add validation
                    it.creature.state.direction = it.direction
                    actions.add(it)
                }
                is Fireball -> {
                    it.startTime = time
                    actions.add(it)
                    spells.add(FireballStrategy(it))
                }
                is Arrival -> actions.add(it)
                is Hide -> actions.add(it)
            }
        }

        playerRequests.clear()
    }

    private fun processSpells(time: Tsm, actions: ActionConsumer) {
        spells.removeIf { it.handle(time, actions, map) }
    }

    private fun processSteps(time: Tsm, actions: ActionConsumer) {
        steps.removeIf { it.handle(time, actions, map) }
    }

    fun subscribe(playerId: Int, handler: (actions: List<Action>) -> Unit) {
        playerHandler[playerId] = handler
    }

    fun send(action: Action) {
        playerRequests.add(action)
    }

    fun unSubscribe(id: Int) {
        playerHandler.remove(id)
    }

    fun onEndTick(function: () -> Unit) {
        endHandler = function
    }

    companion object {
        const val TICK_TIME = 50
        private fun inZone(a: Action, c: Creature, radius: Int) =
            a.x <= c.x + radius && a.x >= c.x - radius && a.y <= c.y + radius && a.y >= c.y - radius

        private fun inZone(other: Creature, c: Creature, radius: Int) =
            other.x <= c.x + radius && other.x >= c.x - radius && other.y <= c.y + radius && other.y >= c.y - radius
    }

}

fun TileType?.isSteppable() = this !== TileType.WALL && this !== TileType.WATER && this !== TileType.NOTHING
