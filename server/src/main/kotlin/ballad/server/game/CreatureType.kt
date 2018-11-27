package ballad.server.game

interface CreatureType {
    val id: Long
    val name: String
    val resource: CreatureResource
}