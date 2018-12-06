package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.actions.Action
import ballad.server.game.actions.Arrival
import ballad.server.game.actions.Damage
import ballad.server.game.actions.Death
import ballad.server.game.actions.Fireball
import ballad.server.game.actions.Hide
import ballad.server.map.TileType
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

        }

        addRequestedActions(actions, time)

        handleSteps(time)
        handleSpells(time, actions)

        map.cleanDeadCreatures()
        map.strategies.forEach { it.onTick(id, time, actions) }

        val playerActions = HashMap<Int, MutableList<Action>>()
        actions.data.forEach {
            if (it is Step) {
                map.steps.add(it)
                //                val plannedId = id + it.duration / TICK_TIME
                //                steps.computeIfAbsent(plannedId, { ArrayList() }).add(it)
            }
        }



        actions.data.forEach { a ->

            map.players.values.forEach { p ->

                val v = p.viewDistance
                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })

                when (a) {
                    is Step -> if (inZone(a, p, v)) pActions.add(a)
                    is Damage -> if (inZone(a, p, v)) pActions.add(a)
                    is Death -> if (inZone(a, p, v)) pActions.add(a)
                }
            }
        }

        map.spells.forEach { s ->
            map.players.values.forEach { p ->

                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })
                if (s.inZone(p.x, p.y, p.viewDistance)) {
                    if (p.spellZone.put(s.id, s) === null) {
                        pActions.add(s)
                    }
                } else {
                    p.spellZone.remove(s.id)
                }

            }
        }

        map.players.values.forEach { p ->
            val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })

            map.npcs.values.forEach { n ->
                if (inZone(n, p, p.viewDistance)) {
                    if (!p.zone.contains(n.id)) {
                        p.zone[n.id] = n
                        pActions.add(Arrival(n.x, n.y, time, n))
                    }
                } else {
                    if (p.zone.remove(n.id) !== null) {
                        pActions.add(Hide(time, n))
                    }
                }

            }


            //            this.map.players.values.filter { p.id != it.id && inZone(it, p, v) }.forEach { pl ->
            //                p.zone[pl.id] = pl
            //                pActions.add(Arrival(time, pl))
            //            }
        }


        //after tick process
        playerActions.forEach { pId, acts ->
            playerHandler[pId]?.invoke(acts)
        }
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
                    map.spells.add(it)
                }
                is Arrival -> actions.add(it)
                is Hide -> actions.add(it)
            }
        }

        playerRequests.clear()
    }

    private fun handleSpells(time: Tsm, actions: ActionConsumer) {
        map.spells.forEach { spell ->

            spell as Fireball //fixme
            val distance = Math.min(spell.distance, Math.round((time - spell.time) / spell.speed.toFloat()))
            spell.distanceTravelled = distance

            val x = spell.currentX
            val y = spell.currentY

            map.npcs.values.filter { it.x == x && it.y == y && it.id != spell.source.id }.forEach { victim ->

                val d = Damage(x, y, time, victim, spell.source, 10)
                victim.damage(d)
                actions.add(d)

                if (victim.state.life == 0) {
                    actions.add(Death(d))
                }
                spell.finished = true
            }


            map.players.values.filter { it.x == x && it.y == y && it.id != spell.source.id }.forEach { victim ->
                val d = Damage(x, y, time, victim, spell.source, 8)
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

        map.spells.removeIf {
            it.finished
        }
    }

    private fun handleSteps(time: Tsm) {
        map.steps.forEach { step ->


            val st = step.creature.state

            //            if(step.time == time) {
            st.direction = step.direction
            //            }
            val distance = Math.min(1, Math.round((time - step.time) / step.duration.toFloat()))
            if (distance > step.distanceTravelled) {
                var xx = st.x
                var yy = st.y
                when (step.direction) {
                    Direction.NORTH -> yy--
                    Direction.SOUTH -> yy++
                    Direction.WEST -> xx--
                    Direction.EAST -> xx++
                }

                val tile = map[xx, yy]
                if (tile !== null) {
                    if (tile.type !== TileType.WALL && tile.type !== TileType.WATER) {
                        if (map.isNoCreatures(xx, yy)) {
                            map.moveCreatures(st.x, st.y, xx, yy)
                            st.x = xx
                            st.y = yy
                            step.distanceTravelled = distance
                        }
                    }
                }
            }

            if (time - step.time >= step.duration) {
                step.finished = true
            }
        }

        map.spells.removeIf {
            it.finished
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

        private fun inZone(other: Creature, c: Creature, radius: Int) =
            other.x <= c.x + radius && other.x >= c.x - radius && other.y <= c.y + radius && other.y >= c.y - radius
    }

}