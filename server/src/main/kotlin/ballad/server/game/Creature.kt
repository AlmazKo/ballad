package ballad.server.game

interface Creature {
    val id: Int
    val name: String
    val state: CreatureState
    val x: Int
    val y: Int
}