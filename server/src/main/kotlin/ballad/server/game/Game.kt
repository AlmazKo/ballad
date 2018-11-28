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

        map.players.values.forEach { p ->

            val x = p.state.x
            val y = p.state.x
            map.npcs.values.forEach { n ->
                val playerActions = ArrayList<Action>()
                if (n.x < x + 10 && n.x > x - 10 && n.y < y + 10 && n.y > y - 10) {
                    if (p.zone.put(n.id, n) == null) {

                        val act = Arrival(n)
                        actions.add(act)
                        playerActions.add(act)


                    }
                    //todo moving

                } else {
                    p.zone.remove(n.id)
                }


                if (this.playerHandler.contains(p.id)) {
                    this.playerHandler[p.id]!!.invoke(playerActions)
                }
            }
        }
    }
    fun subscribe(playerId: Int, handler: (actions: List<Action>) -> Unit) {
        playerHandler[playerId] = handler
    }

}