package ballad.server.game.actions

import ballad.server.Tsm


interface Action {
    val x: Int
    val y: Int
    val time: Tsm
}