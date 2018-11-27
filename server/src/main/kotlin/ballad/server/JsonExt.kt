@file:JvmName("JsonExt")

package ballad.server

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject

val EMPTY = JsonObject(emptyMap())
val EMPTY_ARRAY = JsonArray(emptyList<Any>())

fun jsonArrayOf(vararg elements: Any?): JsonArray {
    return JsonArray(elements.toList())
}

fun jsonOf(key: String, value: Any): JsonObject {
    return JsonObject().put(key, value)
}

fun List<Any>.toJson() = JsonArray(this)

fun <T> List<T>.toJson(mapper: (T) -> Any): JsonArray {
    val result = ArrayList<Any>(size)
    forEach { result.add(mapper(it)) }
    return JsonArray(result)
}
