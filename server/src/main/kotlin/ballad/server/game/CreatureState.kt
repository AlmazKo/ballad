package ballad.server.game

data class CreatureState(
    var life: Int,
    var x: Int,
    var y: Int,
    var direction: Direction
)