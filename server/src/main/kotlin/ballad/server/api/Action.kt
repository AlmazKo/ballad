package ballad.server.api

import ballad.server.game.ActionType
import kotlinx.serialization.Serializable

@Serializable
data class Action(
     val action: ActionType,
     val data: Any
)