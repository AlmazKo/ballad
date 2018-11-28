package ballad.server.game

import ballad.server.tsm
import io.vertx.core.Vertx

class Game(vertx: Vertx, val map: GameMap) {

    private val playerHandler = HashMap<Int, (actions: List<Action>) -> Unit>()
    var id = 0;

    init {
        vertx.setPeriodic(200) { onTick() }
    }

    private fun onTick() {

        val actions = ActionConsumer()

        map.strategies.forEach { it.onTick(id++, tsm(), actions) }
        val playerActions = HashMap<Int, MutableList<Action>>()

        actions.data.forEach { a ->
            map.players.values.forEach { p ->

                val pActions = playerActions.computeIfAbsent(p.id, { ArrayList() })
                when (a) {
                    is Step -> {
                        if (a.x < p.x + 10 && a.x > p.x - 10 && a.y < p.y + 10 && a.y > p.y - 10) {
                            if (!p.zone.contains(a.creatureId)) {
                                val loaded = map.npcs[a.creatureId]!!
                                p.zone[a.creatureId] = loaded
                                pActions.add(Arrival(a.x, a.y, loaded))
                            }
                            pActions.add(a)
                        }
                    }
                }
            }
        }

        //after tick process
        playerActions.forEach { pId, acts -> playerHandler[pId]!!.invoke(acts) }
    }

    fun subscribe(playerId: Int, handler: (actions: List<Action>) -> Unit) {
        playerHandler[playerId] = handler
    }

}