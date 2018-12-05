package ballad.server.game.actions

import ballad.server.Tsm
import ballad.server.game.Creature
import ballad.server.game.Direction
import ballad.server.game.Direction.EAST
import ballad.server.game.Direction.NORTH
import ballad.server.game.Direction.SOUTH
import ballad.server.game.Direction.WEST
import ballad.server.game.Duration

data class Fireball(
    override val id: Long,
    override val x: Int,
    override val y: Int,
    override val time: Tsm,
    val direction: Direction,
    val distance: Int,
    val speed: Duration,
    val source: Creature,
    var startTime: Tsm = 0,
    var distanceTravelled: Int = 0,
    override var finished: Boolean = false
) : SpellAction {

    override fun inZone(objX: Int, objY: Int, radius: Int): Boolean {
        val xx = currentX
        val yy = currentY

        return objX < xx + radius && xx > objX - radius && objY < yy + radius && objY > yy - radius
    }

    val currentX: Int get() = x + (if (direction === WEST) -distanceTravelled else if (direction == EAST) distanceTravelled else 0)

    val currentY: Int get() = y + (if (direction === NORTH) -distanceTravelled else if (direction == SOUTH) distanceTravelled else 0)

}