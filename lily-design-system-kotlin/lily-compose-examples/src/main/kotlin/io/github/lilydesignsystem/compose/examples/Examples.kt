// Worked examples of every lily-compose component, with realistic words (English demo content through the same parameters an
// app localises), and ExampleCatalog: the mobile form of the web apps' /components and /components/{slug} routes.
package io.github.lilydesignsystem.compose.examples

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.compose.AgeView
import io.github.lilydesignsystem.compose.AllergyRecordList
import io.github.lilydesignsystem.compose.AllergyRecordListItem
import io.github.lilydesignsystem.core.AllergyCodes
import io.github.lilydesignsystem.core.AllergyListStatus
import io.github.lilydesignsystem.core.AllergyWords
import io.github.lilydesignsystem.compose.AlertKind
import io.github.lilydesignsystem.compose.DurationView
import io.github.lilydesignsystem.compose.BadgeKind
import io.github.lilydesignsystem.compose.DecisionSupportCard
import io.github.lilydesignsystem.compose.EarlyWarningScoreView
import io.github.lilydesignsystem.compose.OverrideReason
import io.github.lilydesignsystem.compose.Suggestion
import io.github.lilydesignsystem.core.DecisionSupportIndicator
import io.github.lilydesignsystem.compose.ErrorSummary
import io.github.lilydesignsystem.compose.Field
import io.github.lilydesignsystem.compose.InsetText
import io.github.lilydesignsystem.compose.LilyAlert
import io.github.lilydesignsystem.compose.LilyBadge
import io.github.lilydesignsystem.compose.LilyCard
import io.github.lilydesignsystem.compose.LilyMinimumTouchTarget
import io.github.lilydesignsystem.compose.MedicationView
import io.github.lilydesignsystem.core.MedicationNameSegment
import io.github.lilydesignsystem.compose.Politeness
import io.github.lilydesignsystem.compose.Problem
import io.github.lilydesignsystem.compose.SummaryList
import io.github.lilydesignsystem.compose.SummaryListItem
import io.github.lilydesignsystem.compose.Tag
import io.github.lilydesignsystem.compose.WarningText
import io.github.lilydesignsystem.compose.ObservationView
import io.github.lilydesignsystem.core.ObservationStatus
import io.github.lilydesignsystem.core.matchesSearch
import io.github.lilydesignsystem.core.meterScale

/** One worked example: the catalog slug, the composable's name, a one-line summary, its code and the composable itself. */
public class Example(
    public val slug: String,
    public val name: String,
    public val summary: String,
    public val code: String,
    public val content: @Composable () -> Unit,
)

@Composable
private fun ContactFormExample() {
    var name by remember { mutableStateOf("") }
    var submitted by remember { mutableStateOf(false) }
    val nameError = if (submitted && name.isEmpty()) "Enter your full name" else null
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        nameError?.let { ErrorSummary(title = "There is a problem", problems = listOf(Problem(it) {})) }
        Field(
            label = "Full name",
            description = "As it appears on your passport",
            error = nameError,
            required = true,
            requiredLabel = "required",
        ) { BasicTextField(value = name, onValueChange = { name = it }, modifier = it) }
        BasicText(
            "Continue",
            modifier = Modifier
                .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                .clickable(role = Role.Button) { submitted = true },
        )
    }
}

public object Examples {
    /** Every example, in catalog order. */
    public val all: List<Example> = listOf(
        Example(
            "field", "Field", "A label, help text, the control and its error, read once by TalkBack.",
            """
            Field(label = "Full name", description = "As it appears on your passport", error = nameError,
                  required = true, requiredLabel = "required") { BasicTextField(name, { name = it }, modifier = it) }
            """.trimIndent(),
        ) { ContactFormExample() },
        Example(
            "error-summary", "ErrorSummary", "The problems after a failed submit; its title takes focus.",
            """
            ErrorSummary(title = "There is a problem", problems = listOf(
                Problem("Enter your full name") { nameFocus.requestFocus() },
            ))
            """.trimIndent(),
        ) {
            ErrorSummary(
                title = "There is a problem",
                problems = listOf(Problem("Enter your full name") {}, Problem("Enter a date of birth in the past") {}),
                focusOnAppear = false,
            )
        },
        Example(
            "summary-list", "SummaryList", "Labelled term and value pairs, each one TalkBack stop.",
            """
            SummaryList(label = "Personal details") {
                SummaryListItem(term = "Name") { BasicText("Sam Okoro") }
            }
            """.trimIndent(),
        ) {
            SummaryList(label = "Personal details") {
                SummaryListItem(term = "Name") { BasicText("Sam Okoro") }
                SummaryListItem(term = "Date of birth") { BasicText("14 March 1984") }
                SummaryListItem(term = "Contact details") { BasicText("Not given") }
            }
        },
        Example(
            "warning-text", "WarningText", "A warning whose kind is spoken first.",
            """WarningText(prefix = "Warning", text = "You can be fined up to £5,000 if you do not register.")""",
        ) { WarningText(prefix = "Warning", text = "You can be fined up to £5,000 if you do not register.") { BasicText("!") } },
        Example(
            "alert", "LilyAlert", "A message with a severity, in a live region.",
            """LilyAlert(message = "We have sent a confirmation to your email.", kind = AlertKind.Success, heading = "Appointment booked")""",
        ) {
            LilyAlert(
                message = "We have sent a confirmation to your email.",
                kind = AlertKind.Success,
                heading = "Appointment booked",
                politeness = Politeness.Off,
            )
        },
        Example(
            "badge", "LilyBadge", "A short status, a polite live region.",
            """LilyBadge("3", kind = BadgeKind.Info, label = "3 unread messages")""",
        ) { LilyBadge("3", kind = BadgeKind.Info, label = "3 unread messages") },
        Example(
            "tag", "Tag", "A label on an item, spoken with its context.",
            """Tag("High", label = "priority")""",
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Tag("High", label = "priority")
                Tag("Running", label = "Job status", live = true)
            }
        },
        Example(
            "card", "LilyCard", "A heading and its content; a label makes a named group.",
            """LilyCard(heading = "Physiotherapy, 24 November") { BasicText("10:30 at Riverside Health Centre, with Sam Okoro.") }""",
        ) { LilyCard(heading = "Physiotherapy, 24 November") { BasicText("10:30 at Riverside Health Centre, with Sam Okoro.") } },
        Example(
            "inset-text", "InsetText", "Supplementary text set apart, one TalkBack stop.",
            """InsetText { BasicText("It can take up to 8 weeks to register a lasting power of attorney.") }""",
        ) { InsetText { BasicText("It can take up to 8 weeks to register a lasting power of attorney.") } },
        Example(
            "observation-view", "ObservationView",
            "A clinical result with its unit, flag in words, reference range, status and a hidden meter.",
            """
            ObservationView(value = "6.1", unit = "mmol/L", interpretation = "H", flagLabel = "High",
                            range = "3.5 to 5.5 mmol/L", label = "Potassium",
                            meterValue = 6.1, meter = meterScale(6.1, 3.5, 5.5))
            """.trimIndent(),
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                ObservationView(
                    value = "6.1", unit = "mmol/L", interpretation = "H", flagLabel = "High", range = "3.5 to 5.5 mmol/L",
                    label = "Potassium", meterValue = 6.1, meter = meterScale(6.1, 3.5, 5.5),
                )
                ObservationView(
                    value = "138", unit = "mmol/L", status = ObservationStatus.Unavailable,
                    statusLabel = "Result not available yet", label = "Sodium",
                )
            }
        },
        Example(
            "age-view", "AgeView", "An age in the app's words, with its ISO 8601 duration.",
            """AgeView("5 years 2 months", duration = toIsoDuration(parts), label = "Age")""",
        ) { AgeView("5 years 2 months", duration = "P5Y2M", label = "Age") },
        Example(
            "duration-view", "DurationView", "A length of time in the app's words; the direction is in the words.",
            """DurationView("3 days early", duration = "-P3D", label = "Delivery")""",
        ) { DurationView("3 days early", duration = "-P3D", label = "Delivery") },
        Example(
            "allergy-record-list", "AllergyRecordList", "Allergies with every status in words; a list that is never blank.",
            """
            AllergyRecordList(AllergyListStatus.Known, "Known allergies", label = "Allergies") {
                AllergyRecordListItem(
                    AllergyWords("Penicillin", reaction = "Hives", severity = "Moderate", verificationStatus = "Confirmed"),
                    codes = AllergyCodes(severity = "moderate", verificationStatus = "confirmed"),
                )
            }
            """.trimIndent(),
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                AllergyRecordList(AllergyListStatus.Known, "Known allergies", label = "Allergies") {
                    AllergyRecordListItem(
                        AllergyWords("Penicillin", reaction = "Hives", severity = "Moderate", verificationStatus = "Confirmed",
                            category = "Medication"),
                        codes = AllergyCodes(severity = "moderate", verificationStatus = "confirmed"),
                    )
                }
                AllergyRecordList(AllergyListStatus.NoneKnown, "No known allergies")
            }
        },
        Example(
            "medication-view", "MedicationView",
            "A medicine with tall man letters marked by the app; the spoken name stays one word.",
            """
            MedicationView(nameSegments = listOf(MedicationNameSegment("hydr"), MedicationNameSegment("OXY", tallMan = true),
                           MedicationNameSegment("zine")), strength = "25 mg", form = "tablet", route = "oral")
            """.trimIndent(),
        ) {
            MedicationView(
                nameSegments = listOf(
                    MedicationNameSegment("hydr"), MedicationNameSegment("OXY", tallMan = true), MedicationNameSegment("zine"),
                ),
                strength = "25\u00A0mg", form = "tablet", route = "oral", frequency = "twice a day",
            )
        },
        Example(
            "early-warning-score-view", "EarlyWarningScoreView",
            "A score the app computed, its band in words and what to do; Lily computes nothing.",
            """EarlyWarningScoreView("7", system = "NEWS2", band = "high", bandLabel = "High clinical risk")""",
        ) {
            EarlyWarningScoreView(
                "7", system = "NEWS2", band = "high", bandLabel = "High clinical risk",
                escalation = "Call the critical care outreach team",
            )
        },
        Example(
            "decision-support-card", "DecisionSupportCard",
            "A CDS Hooks card: urgency in words, suggestions as buttons, a dismissal that asks for a reason.",
            """
            DecisionSupportCard(
                summary = "Warfarin and aspirin together raise the risk of bleeding",
                indicator = DecisionSupportIndicator.Warning, indicatorLabel = "Warning", sourceLabel = "Local formulary",
                suggestions = listOf(Suggestion("stop-aspirin", "Stop aspirin")), dismissLabel = "Dismiss",
                overrideReasons = listOf(OverrideReason("patient-declined", "Patient declined")),
                overrideReasonLabel = "Reason", overrideReasonError = "Choose a reason to dismiss",
                onSuggestion = ::apply, onDismiss = ::record,
            )
            """.trimIndent(),
        ) {
            DecisionSupportCard(
                summary = "Warfarin and aspirin together raise the risk of bleeding",
                indicator = DecisionSupportIndicator.Warning, indicatorLabel = "Warning", sourceLabel = "Local formulary",
                suggestions = listOf(Suggestion("stop-aspirin", "Stop aspirin")), dismissLabel = "Dismiss",
                overrideReasons = listOf(OverrideReason("patient-declined", "Patient declined")),
                overrideReasonLabel = "Reason", overrideReasonError = "Choose a reason to dismiss",
            ) { BasicText("INR 3.4 on 20 November.") }
        },
    )

    /** The examples whose name, slug or summary match [query], with Lily's search folding (case and accents ignored). */
    public fun matching(query: String): List<Example> = all.filter { matchesSearch("${it.name} ${it.slug} ${it.summary}", query) }
}

/**
 * A searchable list of the examples, and a detail view for the one chosen. Navigation is the app's: pass [selected] and
 * [onSelect] from your NavController or state.
 *
 * @param title the screen's title, in the app's language.
 * @param searchLabel the search field's spoken name, in the app's language.
 */
@Composable
public fun ExampleCatalog(
    title: String,
    searchLabel: String,
    modifier: Modifier = Modifier,
    selected: String? = null,
    onSelect: (String) -> Unit = {},
) {
    val example = Examples.all.firstOrNull { it.slug == selected }
    if (example != null) {
        ExampleDetail(example, modifier)
        return
    }
    var query by remember { mutableStateOf("") }
    Column(modifier = modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        BasicText(title, modifier = Modifier.semantics { heading() })
        BasicTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier.fillMaxWidth().semantics { contentDescription = searchLabel },
        )
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(Examples.matching(query), key = { it.slug }) { item ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                        .clickable(role = Role.Button) { onSelect(item.slug) },
                ) {
                    BasicText(item.name)
                    BasicText(item.summary)
                }
            }
        }
    }
}

/** One example: its summary, the live composable, then its code in a horizontally scrolling block. */
@Composable
public fun ExampleDetail(example: Example, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        BasicText(example.name, modifier = Modifier.semantics { heading() })
        BasicText(example.summary)
        example.content()
        BasicText(
            example.code,
            style = TextStyle(fontFamily = FontFamily.Monospace),
            modifier = Modifier.horizontalScroll(rememberScrollState()),
        )
    }
}
