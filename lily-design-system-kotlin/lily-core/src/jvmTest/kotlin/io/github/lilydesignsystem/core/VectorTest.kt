// Replays shared/vectors/*.json (copied here by bin/sync-shared-modules) against lily-core, so the Kotlin port behaves as the
// TypeScript does (tasks.md P43-T3, P45-T2). A vector file this runner does not know, or a function it cannot call, fails.
package io.github.lilydesignsystem.core

import java.io.File
import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.fail
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.boolean
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.double
import kotlinx.serialization.json.doubleOrNull
import kotlinx.serialization.json.int
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

class VectorTest {
    private fun files(): List<Pair<String, JsonArray>> {
        val url = checkNotNull(javaClass.classLoader.getResource("vectors")) { "no vectors resource; run bin/sync-shared-modules" }
        return File(url.toURI()).listFiles { f -> f.name.endsWith(".json") }!!.sortedBy { it.name }.map {
            it.name to Json.parseToJsonElement(it.readText()).jsonObject["cases"]!!.jsonArray
        }
    }

    private fun str(e: JsonElement) = e.jsonPrimitive.content
    private fun num(e: JsonElement): Double? = if (e is JsonNull) null else e.jsonPrimitive.doubleOrNull
    private fun millis(e: JsonElement): Long = Instant.parse(str(e)).toEpochMilli()
    private fun json(vararg pairs: Pair<String, Any?>): Map<String, Any?> = mapOf(*pairs)

    /** Calls the named function and returns a JSON-shaped Kotlin value (null, Boolean, Number, String, List, Map). */
    private fun call(fn: String, args: JsonArray): Any? = when (fn) {
        "foldText" -> foldText(str(args[0]))
        "searchTerms" -> searchTerms(str(args[0]))
        "matchesSearch" -> matchesSearch(str(args[0]), str(args[1]))
        "highlightSegments" -> highlightSegments(str(args[0]), str(args[1])).map { json("text" to it.text, "match" to it.match) }
        "splitGraphemes" -> splitGraphemes(str(args[0]))
        "truncateMiddleByClusters" -> {
            val o = args[1].jsonObject
            truncateMiddle(
                str(args[0]),
                ellipsis = str(o["ellipsis"]!!),
                maxWidth = o["maxWidth"]!!.jsonPrimitive.double,
                strategy = o["strategy"]?.let { TruncationStrategy.fromKey(str(it)) } ?: TruncationStrategy.Even,
                end = o["end"]?.jsonPrimitive?.int,
                measure = { splitGraphemes(it).size.toDouble() },
            )
        }
        "meterScale" -> {
            val units = args[3] as? JsonObject
            meterScale(
                num(args[0]), num(args[1]), num(args[2]),
                valueUnit = units?.get("value")?.let(::str), rangeUnit = units?.get("range")?.let(::str),
            )?.let { s ->
                buildMap<String, Any?> {
                    put("min", s.min); put("max", s.max)
                    s.low?.let { put("low", it) }
                    s.high?.let { put("high", it) }
                }
            }
        }
        "ageParts" -> ageParts(millis(args[0]), millis(args[1])).map { json("value" to it.value, "unit" to it.unit.key) }
        "toIsoDuration" -> toIsoDuration(args[0].jsonArray.map {
            AgePart(it.jsonObject["value"]!!.jsonPrimitive.int, AgeUnit.fromKey(str(it.jsonObject["unit"]!!))!!)
        })
        "partialDatePrecision" -> partialDatePrecision(str(args[0])).key
        "durationParts" -> durationParts(str(args[0])).let {
            json(
                "years" to it.years, "months" to it.months, "weeks" to it.weeks, "days" to it.days, "hours" to it.hours,
                "minutes" to it.minutes, "seconds" to it.seconds, "negative" to it.negative,
            )
        }
        "htmlDuration" -> htmlDuration(str(args[0]))?.let { json("datetime" to it.datetime, "negative" to it.negative) }
        "isTypeaheadKey" -> {
            val e = args[0].jsonObject
            fun flag(o: JsonObject?, k: String) = o?.get(k)?.jsonPrimitive?.booleanOrNull ?: false
            isTypeaheadKey(
                str(e["key"]!!), ctrl = flag(e, "ctrlKey"), alt = flag(e, "altKey"), meta = flag(e, "metaKey"),
                composing = flag(e, "isComposing") || flag(e["nativeEvent"] as? JsonObject, "isComposing"),
            )
        }
        "nextTypeaheadState" -> {
            val p = args[0].jsonObject
            nextTypeaheadState(
                TypeaheadState(str(p["prefix"]!!), p["at"]!!.jsonPrimitive.content.toLong()),
                str(args[1]), args[2].jsonPrimitive.content.toLong(), args[3].jsonPrimitive.content.toLong(),
            ).let { json("prefix" to it.prefix, "at" to it.at) }
        }
        "findTypeaheadMatch" -> findTypeaheadMatch(args[0].jsonArray.map(::str), args[1].jsonPrimitive.int, str(args[2]))
        "logicalKey" -> logicalKey(str(args[0]), args[1].jsonPrimitive.boolean)
        "ipsSectionCode" -> ipsSectionCode(str(args[0]))
        "ipsSectionIsRequired" -> ipsSectionIsRequired(str(args[0]))
        "ipsSectionId" -> ipsSectionId(
            str(args[0]), args.getOrNull(1)?.let(::str), args.getOrNull(2)?.let(::str) ?: IPS_ID_PREFIX,
        )
        "ipsMissingRequired" -> ipsMissingRequired(args[0].jsonArray.map { str(it.jsonObject["key"]!!) })
        "ipsContents" -> ipsContents(
            args[0].jsonArray.map {
                val o = it.jsonObject
                IpsSectionEntry(str(o["key"]!!), str(o["heading"]!!), o["status"]?.let { s -> IpsSectionStatus.fromKey(str(s)) },
                    o["id"]?.let(::str))
            },
            args[1].jsonObject.mapValues { str(it.value) },
            args.getOrNull(2)?.let(::str) ?: IPS_ID_PREFIX,
        ).map { e ->
            buildMap<String, Any?> {
                put("key", e.key); put("heading", e.heading); put("status", e.status.key); put("id", e.id)
                e.code?.let { put("code", it) }
                put("required", e.required); put("added", e.added)
            }
        }
        "wheelMoveKey" -> wheelMoveKey(
            str(args[0]),
            args.getOrNull(1)?.let { if (str(it) == "horizontal") WheelOrientation.Horizontal else WheelOrientation.Vertical }
                ?: WheelOrientation.Vertical,
            args.getOrNull(2)?.jsonPrimitive?.boolean ?: false,
        )?.key
        "wheelIndexNearest" -> wheelIndexNearest(wheelOptions(args[0]), args[1].jsonArray.map { it.jsonPrimitive.double },
            args[2].jsonPrimitive.double)
        "nextWheelIndex" -> {
            val move = args.getOrNull(3)?.jsonObject
            nextWheelIndex(wheelOptions(args[0]), args[1].jsonPrimitive.int, WheelMoveKey.fromKey(str(args[2]))!!,
                move?.get("loop")?.jsonPrimitive?.boolean ?: false, move?.get("pageSize")?.jsonPrimitive?.double ?: 5.0)
        }
        "nextWheelPrefix" -> {
            val p = args[0].jsonObject
            nextWheelPrefix(WheelTypeahead(str(p["prefix"]!!), p["at"]!!.jsonPrimitive.content.toLong()), str(args[1]),
                args[2].jsonPrimitive.content.toLong(), args[3].jsonPrimitive.content.toLong())
                .let { json("prefix" to it.prefix, "at" to it.at) }
        }
        "wheelTypeaheadIndex" -> wheelTypeaheadIndex(wheelOptions(args[0]), args[1].jsonPrimitive.int, str(args[2]))
        else -> fail("unknown vector function $fn")
    }

    private fun wheelOptions(e: JsonElement): List<WheelOption> = e.jsonArray.map {
        val o = it.jsonObject
        WheelOption(str(o["value"]!!), str(o["label"]!!), o["disabled"]?.jsonPrimitive?.boolean ?: false)
    }

    /** JSON equality: numbers by value (2 and 2.0 alike), objects ignoring order. */
    private fun same(actual: Any?, expected: JsonElement): Boolean = when (expected) {
        is JsonNull -> actual == null
        is JsonArray -> actual is List<*> && actual.size == expected.size && actual.indices.all { same(actual[it], expected[it]) }
        is JsonObject -> actual is Map<*, *> && actual.keys == expected.keys && expected.all { (k, v) -> same(actual[k], v) }
        is JsonPrimitive -> when {
            expected.isString -> actual == expected.content
            expected.booleanOrNull != null -> actual == expected.boolean
            else -> actual is Number && actual.toDouble() == expected.double
        }
    }

    @Test
    fun everyVectorFileIsReadAndPasses() {
        val files = files()
        assertEquals(
            listOf("clinical-format.json", "ips-sections.json", "middle-truncation.json", "search-text.json", "typeahead.json", "wheel-picker.json"),
            files.map { it.first },
        )
        val failures = mutableListOf<String>()
        var count = 0
        for ((name, cases) in files) {
            cases.forEachIndexed { index, element ->
                val c = element.jsonObject
                val fn = str(c["fn"]!!)
                val args = c["args"]!!.jsonArray
                val label = "$name #$index $fn($args)"
                if (c["throws"]?.jsonPrimitive?.booleanOrNull == true) {
                    val threw = try { call(fn, args); false } catch (_: IllegalArgumentException) { true } catch (_: java.time.format.DateTimeParseException) { true }
                    if (!threw) failures += "$label should throw"
                } else {
                    val result = try { call(fn, args) } catch (e: Exception) { failures += "$label threw $e"; null.also { count++ }; return@forEachIndexed }
                    if (!same(result, c["expected"]!!)) failures += "$label: got $result, expected ${c["expected"]}"
                }
                count++
            }
        }
        assertTrue(failures.isEmpty(), failures.joinToString("\n"))
        assertEquals(files.sumOf { it.second.size }, count)
        assertTrue(count >= 211)
    }
}
