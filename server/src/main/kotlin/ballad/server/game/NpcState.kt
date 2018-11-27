package ballad.server.game

data class NpcState(
    var isPassive: Boolean,
    var life: Int,
    var x: Int,
    var y: Int,
    var direction: Direction
)