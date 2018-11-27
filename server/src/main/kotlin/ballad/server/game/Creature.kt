package ballad.server.game

interface Creature {
    val id: Long
    val type: CreatureType
    val life: Int
}