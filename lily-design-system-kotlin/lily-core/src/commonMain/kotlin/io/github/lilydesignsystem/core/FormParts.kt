// The Kotlin port of shared/form-parts.ts, proved equal by shared/vectors/form-parts.json (tasks.md P62-T3): the rules of the date
// field, the quantity input, the repeatable fieldset and the step list, which lily-compose draws natively. Digits are ASCII 0 to
// 9, as in the TypeScript; a field that takes other digits converts them first.
package io.github.lilydesignsystem.core

public enum class DateFieldPart(public val key: String) { Year("year"), Month("month"), Day("day") }

public enum class DateFieldPrecision(public val key: String) {
    Day("day"), Month("month"), Year("year");

    public companion object {
        public fun fromKey(key: String): DateFieldPrecision =
            entries.firstOrNull { it.key == key } ?: throw FormPartsException("precision", "precision $key is not day, month or year")
    }
}

public enum class DateFieldOrder(public val key: String) {
    Ymd("ymd"), Dmy("dmy"), Mdy("mdy");

    public companion object {
        public fun fromKey(key: String): DateFieldOrder =
            entries.firstOrNull { it.key == key } ?: throw FormPartsException("order", "order $key is not ymd, dmy or mdy")
    }
}

/** The three parts of a date as typed; a part the precision does not ask for is "". */
public data class DateParts(val year: String = "", val month: String = "", val day: String = "") {
    public operator fun get(part: DateFieldPart): String = when (part) {
        DateFieldPart.Year -> year
        DateFieldPart.Month -> month
        DateFieldPart.Day -> day
    }
}

/** The parts a date field asks for at a precision, in ISO 8601 order. */
public fun datePartsShown(precision: DateFieldPrecision): List<DateFieldPart> = when (precision) {
    DateFieldPrecision.Day -> listOf(DateFieldPart.Year, DateFieldPart.Month, DateFieldPart.Day)
    DateFieldPrecision.Month -> listOf(DateFieldPart.Year, DateFieldPart.Month)
    DateFieldPrecision.Year -> listOf(DateFieldPart.Year)
}

/** The parts in the order the reader writes them, leaving out those the precision does not ask for. */
public fun dateSequence(order: DateFieldOrder, precision: DateFieldPrecision): List<DateFieldPart> {
    val sequence = when (order) {
        DateFieldOrder.Ymd -> listOf(DateFieldPart.Year, DateFieldPart.Month, DateFieldPart.Day)
        DateFieldOrder.Dmy -> listOf(DateFieldPart.Day, DateFieldPart.Month, DateFieldPart.Year)
        DateFieldOrder.Mdy -> listOf(DateFieldPart.Month, DateFieldPart.Day, DateFieldPart.Year)
    }
    val shown = datePartsShown(precision)
    return sequence.filter { it in shown }
}

private val VALUE = Regex("^([0-9]{1,4})(?:-([0-9]{1,2})(?:-([0-9]{1,2}))?)?$")
private val CALENDAR = Regex("^([0-9]{4})(?:-([0-9]{2})(?:-([0-9]{2}))?)?$")
private val NUMBER = Regex("^[+-]?([0-9]+\\.?[0-9]*|\\.[0-9]+)$")

/** The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else. */
public fun splitDateValue(value: String, precision: DateFieldPrecision): DateParts {
    val m = VALUE.matchEntire(value) ?: return DateParts()
    val groups = m.groupValues.drop(1)
    if (groups.count { it.isNotEmpty() } != datePartsShown(precision).size) return DateParts()
    return DateParts(groups[0], groups[1], groups[2])
}

/** The value once every part asked for is a number, padded to ISO 8601, else "". The calendar check is [isCalendarDate]'s. */
public fun joinDateParts(parts: DateParts, precision: DateFieldPrecision): String {
    val shown = datePartsShown(precision)
    if (!shown.all { p -> parts[p].isNotEmpty() && parts[p].all { it in '0'..'9' } }) return ""
    val iso = listOf(parts.year.padStart(4, '0'), parts.month.padStart(2, '0'), parts.day.padStart(2, '0'))
    return iso.take(shown.size).joinToString("-")
}

/** Whether a value (YYYY, YYYY-MM or YYYY-MM-DD) names a real year, month or day in the Gregorian calendar. */
public fun isCalendarDate(value: String): Boolean {
    val m = CALENDAR.matchEntire(value) ?: return false
    val (y, mo, d) = m.destructured
    val year = y.toInt()
    if (mo.isEmpty()) return true
    val month = mo.toInt()
    if (month !in 1..12) return false
    if (d.isEmpty()) return true
    val leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
    val days = intArrayOf(31, if (leap) 29 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)[month - 1]
    return d.toInt() in 1..days
}

public enum class QuantityProblem(public val key: String) {
    Empty("empty"), NotANumber("not-a-number"), BelowMinimum("below-minimum"), AboveMaximum("above-maximum")
}

/** What is wrong with a magnitude as typed, against its unit's limits, or null when nothing is. The decimal mark is a full stop. */
public fun quantityProblem(magnitude: String, min: Double?, max: Double?): QuantityProblem? {
    if (min != null && !min.isFinite()) throw FormPartsException("limit", "min $min is not a finite number")
    if (max != null && !max.isFinite()) throw FormPartsException("limit", "max $max is not a finite number")
    if (min != null && max != null && min > max) throw FormPartsException("limit", "min $min is above max $max")
    val text = magnitude.trim()
    if (text.isEmpty()) return QuantityProblem.Empty
    if (!NUMBER.matches(text)) return QuantityProblem.NotANumber
    val n = text.toDouble()
    if (min != null && n < min) return QuantityProblem.BelowMinimum
    if (max != null && n > max) return QuantityProblem.AboveMaximum
    return null
}

/** Whether a repeatable fieldset may add another item: below its maximum, or always when it has none. */
public fun canAddItem(count: Int, max: Int?): Boolean {
    if (count < 0) throw FormPartsException("count", "count $count is not a whole number of items")
    if (max == null) return true
    if (max < 0) throw FormPartsException("limit", "max $max is not a whole number")
    return count < max
}

/** Whether a repeatable fieldset may remove an item: above its minimum. */
public fun canRemoveItem(count: Int, min: Int): Boolean {
    if (count < 0) throw FormPartsException("count", "count $count is not a whole number of items")
    if (min < 0) throw FormPartsException("limit", "min $min is not a whole number")
    return count > min
}

public enum class StepStatus(public val key: String) { Finished("finished"), InProgress("in-progress"), Waiting("waiting") }

/** A step's status from its index and the current step's: before it finished, at it in progress, after it waiting. */
public fun stepStatus(index: Int, current: Int): StepStatus {
    if (index < 0 || current < 0) throw FormPartsException("index", "index $index or current $current is not a step")
    return when {
        index < current -> StepStatus.Finished
        index == current -> StepStatus.InProgress
        else -> StepStatus.Waiting
    }
}
