package ballad.server.api

import ballad.server.game.Game
import ballad.server.game.Player
import ballad.server.game.actions.Step
import ballad.server.game.actions.Action
import ballad.server.game.actions.Arrival
import ballad.server.game.actions.BackStep
import ballad.server.game.actions.Damage
import ballad.server.game.actions.Death
import ballad.server.game.actions.Fireball
import ballad.server.game.actions.Hide
import ballad.server.game.actions.ReSpawn
import ballad.server.game.actions.SpellAction
import ballad.server.tsm
import io.vertx.core.http.WebSocketBase
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory
import kotlinx.serialization.json.JSON

class PlayerSession(
    private val p: Player,
    private val ws: WebSocketBase,
    private val game: Game
) {

    private val log = LoggerFactory.getLogger(javaClass)

    init {

        val arr = Arrival(p.x, p.y, tsm(), p)
        game.send(arr)

        val act = JSON.stringify(ballad.server.api.Arrival.serializer(), ballad.server.api.Arrival(arr))
        ws.writeFinalTextFrame("""{"action":"PROTAGONIST_ARRIVAL", "data": $act}""")
        ws.closeHandler {
            game.unSubscribe(p.id)
            game.send(Hide(tsm(), p))
            log.info("Connection is closed: ${p.id}")
        }

        ws.textMessageHandler(::onClientMessage)
        game.subscribe(p.id, ::onGameActions)
    }

    private fun onGameActions(actions: List<Action>) {
        actions.forEach {

            if (it is SpellAction) {
                val act = when (it) {
                    is Fireball -> JSON.stringify(ballad.server.api.Fireball.serializer(), Fireball(it))
                    else -> return@forEach
                }
                ws.writeFinalTextFrame("""{"action":"SPELL", "type":"${it.javaClass.simpleName.toUpperCase()}", "id": ${it.id}, "data": $act}""")
            } else {
                val act = when (it) {
                    is Hide -> JSON.stringify(ballad.server.api.Hide.serializer(), ballad.server.api.Hide(it))
                    is Arrival -> JSON.stringify(ballad.server.api.Arrival.serializer(), ballad.server.api.Arrival(it))
                    is ReSpawn -> JSON.stringify(ballad.server.api.Respawn.serializer(), ballad.server.api.Respawn(it))
                    is Step -> JSON.stringify(ballad.server.api.Step.serializer(), ballad.server.api.Step(it))
                    is BackStep -> JSON.stringify(ballad.server.api.BackStep.serializer(), ballad.server.api.BackStep(it))
                    is Damage -> JSON.stringify(ballad.server.api.Damage.serializer(), ballad.server.api.Damage(it))
                    is Death -> JSON.stringify(ballad.server.api.Death.serializer(), ballad.server.api.Death(it))
                    else -> return@forEach
                }
                ws.writeFinalTextFrame("""{"action":"${it.javaClass.simpleName.toUpperCase()}", "data": $act}""")
            }
        }
    }

    private fun onClientMessage(msg: String?) {
        val raw = JsonObject(msg)
        val data = raw.getJsonObject("data")
        val id = raw.getLong("id")

        val act = when (raw.getString("action")) {
            "STEP" -> {
                Step(
                    x = data.getInteger("x"),
                    y = data.getInteger("y"),
                    time = tsm(), //fixme
                    creature = p,
                    duration = data.getInteger("duration"),
                    direction = mapToDirection[data.getInteger("direction")]!!
                )
            }
            "SPELL" -> {
                val spellType = data.getString("type")
                Fireball(
                    id = id,
                    x = data.getInteger("x"),
                    y = data.getInteger("y"),
                    time = tsm(), //fixme
                    distance = data.getInteger("distance"),
                    speed = data.getInteger("speed"),
                    source = p,
                    direction = mapToDirection[data.getInteger("direction")]!!
                )
            }
            else -> return
        }

        game.send(act)
    }
}