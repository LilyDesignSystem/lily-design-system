// MedicationView (components/medication-view): a medicine's name, strength, form, route, frequency and free-text dosage. Tall
// man segments the app marks are bold; the spoken name stays one word. One TalkBack stop; no part is truncated.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.MedicationNameSegment
import io.github.lilydesignsystem.core.MedicationRules

/** The name with each tall man segment in bold; null when there is no name. */
public fun medicationName(name: String?, segments: List<MedicationNameSegment>): AnnotatedString? {
    if (segments.isEmpty()) return name?.let { AnnotatedString(it) }
    return buildAnnotatedString {
        segments.forEach { segment ->
            if (segment.tallMan) withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append(segment.text) } else append(segment.text)
        }
    }
}

/**
 * @param name the name as plain text; or [nameSegments], with tall man letters marked, which wins when given.
 * @param strength formatted by the app (`formatQuantity` writes "5 mg", never "5.0 mg").
 * @param dosageText the dose as free text, when the record has no structured parts.
 * @param label spoken first, naming the value.
 */
@Composable
public fun MedicationView(
    modifier: Modifier = Modifier,
    name: String? = null,
    nameSegments: List<MedicationNameSegment> = emptyList(),
    strength: String? = null,
    form: String? = null,
    route: String? = null,
    frequency: String? = null,
    dosageText: String? = null,
    label: String? = null,
) {
    val styles = LocalLilyTextStyles.current
    val spoken = MedicationRules.spoken(label, name, nameSegments, strength, form, route, frequency, dosageText)
    Column(
        modifier = modifier.clearAndSetSemantics { contentDescription = spoken },
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        medicationName(name, nameSegments)?.let { BasicText(it, style = styles.body) }
        listOf(strength, form, route, frequency, dosageText).filterNotNull().filter { it.isNotEmpty() }
            .forEach { BasicText(it, style = styles.body) }
    }
}
