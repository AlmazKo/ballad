package ballad.server.game

class NpcState(
    var isPassive: Boolean,
    var maxLife: Int,
    var life: Int,
    var x: Int,
    var y: Int,
    var direction: Direction
)