package ballad.server.game

import ballad.server.Tsm
import ballad.server.game.actions.Step

class StepStrategy(val action: Step) {

    fun handle(time: Tsm, actions: ActionConsumer, map: GameMap): Boolean {

        val st = action.creature.state

        //            if(action.time == time) {
        st.direction = action.direction
        //            }
        val distance = Math.min(1, Math.round((time - action.time) / action.duration.toFloat()))
        if (distance > action.distanceTravelled && step(st, action.direction, map)) {
            action.distanceTravelled = distance
        }

        if (time - action.time >= action.duration) {
            action.finished = true
        }

        return action.finished
    }


    private fun step(st: CreatureState, dir: Direction, map: GameMap): Boolean {
        var xx = st.x
        var yy = st.y
        when (dir) {
            Direction.NORTH -> yy--
            Direction.SOUTH -> yy++
            Direction.WEST -> xx--
            Direction.EAST -> xx++
        }

        val tile = map[xx, yy]
        if (tile !== null) {
            if (tile.type.isSteppable()) {
                if (map.isNoCreatures(xx, yy)) {
                    val obj = map.getObject(xx, yy)

                    if (obj !== null && !obj.type.isSteppable()) return false;

                    map.moveCreature(st.x, st.y, xx, yy)
                    st.x = xx
                    st.y = yy
                    return true
                }
            }
        }

        return false
    }


}