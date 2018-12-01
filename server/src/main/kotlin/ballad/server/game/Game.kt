package ballad.server.game

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


        val playerActions = HashMap<Int, MutableList<Action>>()

        actions.data.forEach { a ->
            map.players.values.forEach { p ->

                val v = p.viewDistance
                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })
                when (a) {
                    is Step -> {
                        if (a.x <= p.x + v && a.x >= p.x - v && a.y <= p.y + v && a.y >= p.y - v) {
                            if (p.id != a.creature.id && !p.zone.contains(a.creature.id)) {
                                p.zone[a.creature.id] = a.creature
                                val arr = Arrival(a.x, a.y, time, a.creature)
//                                log.info("New Player action: {}", arr)
                                pActions.add(arr)
                            }
//                            log.info("New Player action: {}", a)
                            pActions.add(a)
                        } else {
                            p.zone.remove(a.creature.id)
                        }
                    }
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
    }

}