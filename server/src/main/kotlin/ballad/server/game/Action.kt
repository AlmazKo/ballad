package ballad.server.game

import ballad.server.Tsm


interface Action {
    val x: Int
    val y: Int
    val time: Tsm
}