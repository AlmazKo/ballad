package ballad.server.game

import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH
import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.tsm
import io.vertx.core.Vertx
import io.vertx.core.logging.LoggerFactory

class Game(vertx: Vertx, val map: GameMap) {

    private val log = LoggerFactory.getLogger(javaClass)
    private val playerHandler = HashMap<Int, (actions: List<Action>) -> Unit>()
    private val playerRequests = ArrayList<Action>()

    var id = -1


    private val steps = HashMap<Int, MutableList<Step>>()

    init {
        vertx.setPeriodic(TICK_TIME.toLong()) { onTick() }
    }

    private fun onTick() {

        id++

        val time = tsm()
        val actions = ActionConsumer()


        val planned = steps.remove(id)

        if (planned !== null) {
            planned.forEach {
                it.creature.step(it.direction)
            }
        }

        playerRequests.forEach {

            if (it is Step) {
                //add validation
                it.creature.state.direction = it.direction
                actions.add(it)
            }

            if (it is Fireball) {
                it.startTime = time
                actions.add(it)
                map.spells.add(it)
            }

            if (it is Arrival) {
                actions.add(it)
            }
        }

        playerRequests.clear()


        map.strategies.forEach { it.onTick(id, time, actions) }

        actions.data.forEach {
            if (it is Step) {
                val plannedId = id + it.duration / TICK_TIME
                steps.computeIfAbsent(plannedId, { ArrayList() }).add(it)
            }
        }


        map.spells.forEach { spell ->

            spell as Fireball //fixme
            val distance = Math.round((time - spell.time) / spell.speed.toFloat())

            val x = spell.x + (if (spell.direction === WEST) -distance else if (spell.direction == EAST) distance else 0)
            val y = spell.x + (if (spell.direction === NORTH) -distance else if (spell.direction == SOUTH) distance else 0)
            map.npcs.values.filter { it.x == x && it.y == y && it.id != spell.creature.id }.forEach { victim ->

                val d = Damage(x, y, time, victim, spell.creature, 10)
                victim.damage(d)
                actions.add(d)

                if (victim.state.life == 0) {
                    actions.add(Death(d))
                }
                spell.finished = true
            }


            map.players.values.filter { it.x == x && it.y == y && it.id != spell.creature.id }.forEach { victim ->
                val d = Damage(x, y, time, victim, spell.creature, 10)
                victim.damage(d)
                actions.add(d)

                if (victim.state.life == 0) {
                    actions.add(Death(d))
                }
                spell.finished = true
            }

            if (distance >= spell.distance) {
                spell.finished = true
            }
        }


        map.strategies.removeIf {
            val isActive = it.isActive()
            if (!isActive) map.npcs.remove(it.npcId)

            !isActive
        }

        map.spells.removeIf { it.finished }

        val playerActions = HashMap<Int, MutableList<Action>>()

        actions.data.forEach { a ->
            map.players.values.forEach { p ->

                val v = p.viewDistance
                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })
                when (a) {
                    is Arrival -> {
                        if (inZone(a, p, v)) {
                            if (p.id != a.creature.id && !p.zone.contains(a.creature.id)) {
                                p.zone[a.creature.id] = a.creature
                                pActions.add(a)
                            }
                        }
                    }
                    is Step -> {
                        if (inZone(a, p, v)) {1
                            if (p.id != a.creature.id && !p.zone.contains(a.creature.id)) {
                                p.zone[a.creature.id] = a.creature
                                val arr = Arrival(a.x, a.y, time, a.creature)
                                pActions.add(arr)
                            }
                            pActions.add(a)
                        } else {
                            p.zone.remove(a.creature.id)
                        }
                    }
                    is Damage -> if (inZone(a, p, v)) pActions.add(a)
                    is Death -> if (inZone(a, p, v)) pActions.add(a)
                }
            }
        }

        //after tick process
        playerActions.forEach { pId, acts ->
            playerHandler[pId]?.invoke(acts)
        }
    }

    fun subscribe(playerId: Int, handler: (actions: List<Action>) -> Unit) {
        playerHandler[playerId] = handler
    }

    fun send(action: Action) {
        playerRequests.add(action)
    }

    companion object {
        const val TICK_TIME = 50
        private fun inZone(a: Action, c: Creature, radius: Int) =
            a.x <= c.x + radius && a.x >= c.x - radius && a.y <= c.y + radius && a.y >= c.y - radius
    }

}