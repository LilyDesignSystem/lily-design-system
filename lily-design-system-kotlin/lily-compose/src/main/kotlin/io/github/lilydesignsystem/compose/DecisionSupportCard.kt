// DecisionSupportCard (components/decision-support-card): a CDS Hooks card. A named traversal group (the summary), its urgency
// in words, its source, suggestions as 48dp buttons, links (LinkAnnotation, opened by the platform), the app's detail, and a
// dismiss button that asks for a reason when reasons are offered (a radio group). A dismissal without one is refused: the
// reasons get the app's error words as error semantics and take focus. Not a live region.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withLink
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.DecisionSupportIndicator
import io.github.lilydesignsystem.core.DecisionSupportRules
import io.github.lilydesignsystem.core.DismissOutcome

/** A suggestion: a real button; the app applies it and enforces selectionBehavior. */
public data class Suggestion(val id: String, val label: String, val isRecommended: Boolean = false)

/** A link to more information. */
public data class CardLink(val label: String, val url: String)

/** A reason for dismissing (CDS Hooks overrideReasons). */
public data class OverrideReason(val code: String, val display: String)

@Composable
private fun LinkText(label: String, url: String) {
    BasicText(
        buildAnnotatedString { withLink(LinkAnnotation.Url(url)) { append(label) } },
        style = LocalLilyTextStyles.current.body,
        modifier = Modifier.defaultMinSize(minHeight = LilyMinimumTouchTarget),
    )
}

/**
 * @param summary the one-sentence summary (under 140 characters); names the card.
 * @param indicator the urgency; [indicatorLabel] is its words (required: urgency is never colour alone).
 * @param cardId which card this is (the CDS Hooks uuid with the patient's id). A new one, or without one a new summary, indicator
 *   or source, clears the chosen reason.
 * @param sourceLabel where the guidance comes from; [sourceUrl] links to it.
 * @param suggestions each a button; [onSuggestion] gets its id.
 * @param dismissLabel the dismiss button's words; no button without them.
 * @param overrideReasons when given, dismissing needs one; [overrideReasonLabel] names the group.
 * @param overrideReasonError words set as the reasons' error when a dismissal is refused.
 * @param onDismiss called with the chosen reason's code, or null when no reasons are offered.
 */
@Composable
public fun DecisionSupportCard(
    summary: String,
    indicator: DecisionSupportIndicator,
    indicatorLabel: String,
    sourceLabel: String,
    modifier: Modifier = Modifier,
    cardId: String? = null,
    sourceUrl: String? = null,
    suggestions: List<Suggestion> = emptyList(),
    links: List<CardLink> = emptyList(),
    dismissLabel: String? = null,
    overrideReasons: List<OverrideReason> = emptyList(),
    overrideReasonLabel: String? = null,
    overrideReasonError: String? = null,
    label: String? = null,
    onSuggestion: (String) -> Unit = {},
    onDismiss: (String?) -> Unit = {},
    detail: @Composable () -> Unit = {},
) {
    DecisionSupportRules.warnings(summary, indicatorLabel, sourceLabel, overrideReasons.isNotEmpty(), overrideReasonLabel)
        .forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    // A chosen reason belongs to one card, and to the reasons it offers.
    val identity = DecisionSupportRules.identity(cardId, summary, indicator, sourceLabel)
    var chosen by remember(identity) { mutableStateOf<String?>(null) }
    var refused by remember(identity) { mutableStateOf(false) }
    if (chosen != null && overrideReasons.none { it.code == chosen }) chosen = null
    val reasonsFocus = remember { FocusRequester() }
    Column(
        modifier = modifier.semantics {
            isTraversalGroup = true
            contentDescription = DecisionSupportRules.name(label, summary)
        },
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        BasicText(indicatorLabel, style = styles.small)
        BasicText(summary, style = styles.heading, modifier = Modifier.semantics { heading() })
        if (sourceUrl != null) LinkText(sourceLabel, sourceUrl) else BasicText(sourceLabel, style = styles.small)
        detail()
        suggestions.forEach { suggestion ->
            BasicText(
                suggestion.label,
                style = styles.strong,
                modifier = Modifier
                    .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                    .clickable(role = Role.Button) { onSuggestion(suggestion.id) },
            )
        }
        links.forEach { LinkText(it.label, it.url) }
        if (dismissLabel != null) {
            if (overrideReasons.isNotEmpty()) {
                val errorText = overrideReasonError
                Column(
                    modifier = Modifier
                        .focusRequester(reasonsFocus)
                        .focusable()
                        .selectableGroup()
                        .semantics {
                            contentDescription = overrideReasonLabel ?: ""
                            if (refused && !errorText.isNullOrEmpty()) error(errorText)
                        },
                ) {
                    overrideReasons.forEach { reason ->
                        BasicText(
                            reason.display,
                            style = styles.body,
                            modifier = Modifier
                                .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                                .selectable(selected = chosen == reason.code, role = Role.RadioButton) {
                                    chosen = reason.code
                                    refused = false
                                },
                        )
                    }
                }
            }
            BasicText(
                dismissLabel,
                style = styles.strong,
                modifier = Modifier
                    .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                    .clickable(role = Role.Button) {
                        when (val outcome = DecisionSupportRules.dismiss(overrideReasons.map { it.code }, chosen)) {
                            is DismissOutcome.Dismissed -> onDismiss(outcome.reason)
                            DismissOutcome.Refused -> {
                                refused = true
                                reasonsFocus.requestFocus()
                            }
                        }
                    },
            )
        }
    }
}
