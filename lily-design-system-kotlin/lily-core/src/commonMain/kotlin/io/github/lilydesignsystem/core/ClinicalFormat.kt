// The Kotlin port of the locale-independent half of shared/clinical-format.ts, proved equal by
// shared/vectors/clinical-format.json (tasks.md P43-T3). These functions decide how a value is written or drawn, never what
// the value is. Dates are UTC epoch milliseconds, so the module needs no date library.
package io.github.lilydesignsystem.core

/** A meter's scale for a value and its reference range (observation-view). A drawing decision, never a clinical one. */
public data class MeterScale(val min: Double, val max: Double, val low: Double? = null, val high: Double? = null)

/** A value on its meter scale, checked: a value that is not finite or lies outside the scale is an error, never clamped. */
public class MeterReading(public val value: Double, public val scale: MeterScale) {
    init {
        require(value.isFinite() && value >= scale.min && value <= scale.max) { "meter value $value is off its scale" }
    }
}

/**
 * Two-sided range: half a range beyond each end. One-sided: from zero to half as far again as the bound. Always wide enough to
 * hold the value. `null` (draw no meter) when the value or a given end is not finite, when neither end is given, when a
 * two-sided range is reversed or has no width, when a one-sided bound is not above zero, or when the units differ.
 */
public fun meterScale(
    value: Double?,
    low: Double? = null,
    high: Double? = null,
    valueUnit: String? = null,
    rangeUnit: String? = null,
): MeterScale? {
    if (value == null || !value.isFinite()) return null
    if (!valueUnit.isNullOrEmpty() && !rangeUnit.isNullOrEmpty() && valueUnit != rangeUnit) return null
    if ((low != null && !low.isFinite()) || (high != null && !high.isFinite())) return null
    val lower: Double
    val upper: Double
    if (low != null && high != null) {
        if (low >= high) return null
        val half = (high - low) / 2
        lower = low - half
        upper = high + half
    } else {
        val bound = high ?: low ?: return null
        if (bound <= 0) return null
        lower = 0.0
        upper = bound * 1.5
    }
    return MeterScale(minOf(lower, value), maxOf(upper, value), low, high)
}

public enum class AgeUnit(public val key: String) {
    Minutes("minutes"), Hours("hours"), Days("days"), Weeks("weeks"), Months("months"), Years("years");

    public companion object {
        public fun fromKey(key: String): AgeUnit? = entries.firstOrNull { it.key == key }
    }
}

public data class AgePart(val value: Int, val unit: AgeUnit)

private const val MINUTE = 60_000L
private const val HOUR = 60 * MINUTE
private const val DAY = 24 * HOUR

/** A UTC calendar date and time of day, from epoch milliseconds (Howard Hinnant's civil-from-days). */
private data class Civil(val year: Int, val month: Int, val day: Int, val timeOfDay: Long)

private fun civil(epochMillis: Long): Civil {
    val days = epochMillis.floorDiv(DAY)
    val timeOfDay = epochMillis - days * DAY
    val z = days + 719_468
    val era = z.floorDiv(146_097L)
    val doe = z - era * 146_097
    val yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365
    val doy = doe - (365 * yoe + yoe / 4 - yoe / 100)
    val mp = (5 * doy + 2) / 153
    val day = (doy - (153 * mp + 2) / 5 + 1).toInt()
    val month = (if (mp < 10) mp + 3 else mp - 9).toInt()
    val year = (yoe + era * 400 + if (month <= 2) 1 else 0).toInt()
    return Civil(year, month, day, timeOfDay)
}

private fun daysFromCivil(year: Int, month: Int, day: Int): Long {
    val y = (if (month <= 2) year - 1 else year).toLong()
    val era = y.floorDiv(400L)
    val yoe = y - era * 400
    val m = month.toLong()
    val doy = (153 * (if (m > 2) m - 3 else m + 9) + 2) / 5 + day - 1
    val doe = yoe * 365 + yoe / 4 - yoe / 100 + doy
    return era * 146_097 + doe - 719_468
}

private fun daysInMonth(year: Int, month: Int): Int {
    val nextYear = if (month == 12) year + 1 else year
    val nextMonth = if (month == 12) 1 else month + 1
    return (daysFromCivil(nextYear, nextMonth, 1) - daysFromCivil(year, month, 1)).toInt()
}

/** Whole months counted from birth (a day past the end of a shorter month lands on its last day), then the days after them. */
private fun calendarDifference(birth: Long, at: Long): Triple<Int, Int, Int> {
    val b = civil(birth)
    val a = civil(at)
    val earlier = if (a.timeOfDay < b.timeOfDay) 1 else 0
    var totalMonths = (a.year - b.year) * 12 + a.month - b.month
    var days = a.day - b.day - earlier
    if (totalMonths > 0 && days < 0) {
        totalMonths -= 1
        val monthIndex = b.month - 1 + totalMonths
        val year = b.year + monthIndex / 12
        val month = monthIndex % 12 + 1
        val anchor = daysFromCivil(year, month, minOf(b.day, daysInMonth(year, month)))
        days = (daysFromCivil(a.year, a.month, a.day) - anchor).toInt() - earlier
    }
    return Triple(totalMonths / 12, totalMonths % 12, days)
}

/**
 * The age at [atMillis] of someone born at [birthMillis] (UTC epoch milliseconds), in the NHS Common User Interface's unit
 * bands. Returns numbers and unit keys, never words: format them with the platform's MeasureFormat or the consumer's labels.
 */
public fun ageParts(birthMillis: Long, atMillis: Long): List<AgePart> {
    val elapsed = atMillis - birthMillis
    require(elapsed >= 0) { "ageParts: at is before birth" }
    if (elapsed < 2 * HOUR) return listOf(AgePart((elapsed / MINUTE).toInt(), AgeUnit.Minutes))
    if (elapsed < 2 * DAY) return listOf(AgePart((elapsed / HOUR).toInt(), AgeUnit.Hours))
    val totalDays = (elapsed / DAY).toInt()
    if (totalDays < 28) return listOf(AgePart(totalDays, AgeUnit.Days))
    val (years, months, days) = calendarDifference(birthMillis, atMillis)
    if (years < 1) return listOf(AgePart(totalDays / 7, AgeUnit.Weeks), AgePart(totalDays % 7, AgeUnit.Days))
    if (years < 2) return listOf(AgePart(years * 12 + months, AgeUnit.Months), AgePart(days, AgeUnit.Days))
    if (years < 18) return listOf(AgePart(years, AgeUnit.Years), AgePart(months, AgeUnit.Months))
    return listOf(AgePart(years, AgeUnit.Years))
}

/** Age parts as an ISO 8601 duration; weeks are written as days. */
public fun toIsoDuration(parts: List<AgePart>): String {
    var years = 0; var months = 0; var days = 0; var hours = 0; var minutes = 0
    for (part in parts) {
        when (part.unit) {
            AgeUnit.Years -> years += part.value
            AgeUnit.Months -> months += part.value
            AgeUnit.Weeks -> days += part.value * 7
            AgeUnit.Days -> days += part.value
            AgeUnit.Hours -> hours += part.value
            AgeUnit.Minutes -> minutes += part.value
        }
    }
    val date = (if (years != 0) "${years}Y" else "") + (if (months != 0) "${months}M" else "") + (if (days != 0) "${days}D" else "")
    val time = (if (hours != 0) "${hours}H" else "") + (if (minutes != 0) "${minutes}M" else "")
    if (date.isEmpty() && time.isEmpty()) return "PT0M"
    return "P$date" + if (time.isEmpty()) "" else "T$time"
}

public enum class DatePrecision(public val key: String) { Year("year"), Month("month"), Day("day") }

private val PARTIAL_DATE = Regex("""^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$""")

/** "year", "month" or "day": how precise a partial ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD) is. */
public fun partialDatePrecision(iso: String): DatePrecision {
    val match = PARTIAL_DATE.matchEntire(iso) ?: throw IllegalArgumentException("not a partial ISO 8601 date: $iso")
    val year = match.groupValues[1].toInt()
    val month = match.groups[2]?.value?.toInt()
    val day = match.groups[3]?.value?.toInt()
    require(month == null || month in 1..12) { "not a month: $iso" }
    require(day == null || day in 1..daysInMonth(year, month!!)) { "not a calendar date: $iso" }
    return when {
        day != null -> DatePrecision.Day
        month != null -> DatePrecision.Month
        else -> DatePrecision.Year
    }
}

/** The parts of an ISO 8601 duration, nothing converted: 90 minutes stays 90 minutes, a month is never turned into days. */
public data class DurationParts(
    val years: Int = 0,
    val months: Int = 0,
    val weeks: Int = 0,
    val days: Int = 0,
    val hours: Int = 0,
    val minutes: Int = 0,
    val seconds: Double = 0.0,
    val negative: Boolean = false,
)

private val ISO_DURATION =
    Regex("""^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$""")
private val EMPTY_DURATION = Regex("""^-?PT?$""")

public fun durationParts(iso: String): DurationParts {
    val match = ISO_DURATION.matchEntire(iso)
    require(match != null && !EMPTY_DURATION.matches(iso)) { "not an ISO 8601 duration: $iso" }
    fun n(i: Int) = match.groups[i]?.value?.toInt() ?: 0
    return DurationParts(
        years = n(2), months = n(3), weeks = n(4), days = n(5), hours = n(6), minutes = n(7),
        seconds = match.groups[8]?.value?.toDouble() ?: 0.0,
        negative = match.groups[1] != null,
    )
}

/** An ISO 8601 duration as an HTML-style datetime value (days, hours, minutes, seconds; sign apart), or `null`. */
public data class HtmlDuration(val datetime: String, val negative: Boolean)

public fun htmlDuration(iso: String): HtmlDuration? {
    val parts = try { durationParts(iso) } catch (_: IllegalArgumentException) { return null }
    val datePart = iso.substringBefore("T")
    if (parts.years != 0 || parts.months != 0 || parts.weeks != 0 || Regex("""[YW]|P\d+M""").containsMatchIn(datePart)) return null
    return HtmlDuration(iso.removePrefix("-"), parts.negative)
}
