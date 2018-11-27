package ballad.server.api

import ballad.server.game.ActionType
import kotlinx.serialization.Serializable

@Serializable
class Action(
    private val action: ActionType,
    private val data: Any
)