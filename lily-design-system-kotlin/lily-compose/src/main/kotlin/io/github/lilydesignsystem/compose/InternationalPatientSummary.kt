// InternationalPatientSummary and InternationalPatientSummarySection (components/international-patient-summary*). Structure
// only: Lily parses no FHIR. The summary is a labelled traversal group: the banner, the contents (buttons that call back with
// a section key, for the app to scroll to it), the app's sections, an omitted section for each missing required one, then the
// details. A section is a traversal group under a heading(), with its status in words and an optional narrative Disclosure.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.IpsRules
import io.github.lilydesignsystem.core.IpsSectionEntry
import io.github.lilydesignsystem.core.IpsSectionStatus
import io.github.lilydesignsystem.core.IpsStatusPlacement
import io.github.lilydesignsystem.core.ipsContents

/**
 * @param section the IPS section key ("allergies").
 * @param heading the heading, in the app's words. Required.
 * @param statusLabel the status in words; required for any status but known, unless [statusPlacement] is List.
 * @param narrativeLabel names the author's [narrative], shown behind a [Disclosure].
 */
@Composable
public fun InternationalPatientSummarySection(
    section: String,
    heading: String,
    modifier: Modifier = Modifier,
    status: IpsSectionStatus = IpsSectionStatus.Known,
    statusLabel: String? = null,
    statusPlacement: IpsStatusPlacement = IpsStatusPlacement.Heading,
    narrativeLabel: String? = null,
    narrativeOpen: Boolean = false,
    narrative: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit = {},
) {
    IpsRules.sectionWarnings(heading, status, statusLabel, statusPlacement, narrative != null, narrativeLabel)
        .forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    Column(
        modifier = modifier.semantics { isTraversalGroup = true },
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        BasicText(heading, style = styles.heading, modifier = Modifier.semantics { heading() })
        if (IpsRules.showsStatusLine(status, statusPlacement)) statusLabel?.let { BasicText(it, style = styles.body) }
        content()
        if (narrative != null) Disclosure(narrativeLabel ?: "", initiallyOpen = narrativeOpen, content = narrative)
    }
}

/**
 * @param label the summary's accessible name. Required.
 * @param sections the sections the app renders, as plain data, in document order.
 * @param requiredHeadings headings for an added, missing required section (medications, allergies, problems).
 * @param omittedLabel the words an added section shows ("Section missing from document").
 * @param contentsLabel names the contents; without it there are none.
 * @param onSelectSection called with a section key when its contents entry is chosen; scroll to it in the app.
 */
@Composable
public fun InternationalPatientSummary(
    label: String,
    sections: List<IpsSectionEntry>,
    requiredHeadings: Map<String, String>,
    omittedLabel: String,
    modifier: Modifier = Modifier,
    contentsLabel: String? = null,
    onSelectSection: (String) -> Unit = {},
    banner: @Composable () -> Unit = {},
    details: @Composable () -> Unit = {},
    content: @Composable () -> Unit = {},
) {
    IpsRules.summaryWarnings(label, omittedLabel, requiredHeadings).forEach { LilyWarnings.warn(it) }
    val contents = ipsContents(sections, requiredHeadings)
    Column(
        modifier = modifier.semantics {
            isTraversalGroup = true
            contentDescription = label
        },
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        banner()
        if (contentsLabel != null) {
            Column(modifier = Modifier.semantics { isTraversalGroup = true; contentDescription = contentsLabel }) {
                contents.forEach { entry ->
                    BasicText(
                        entry.heading,
                        style = LocalLilyTextStyles.current.body,
                        modifier = Modifier
                            .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                            .clickable(role = Role.Button) { onSelectSection(entry.key) },
                    )
                }
            }
        }
        content()
        contents.filter { it.added }.forEach { entry ->
            InternationalPatientSummarySection(entry.key, entry.heading, status = IpsSectionStatus.Omitted, statusLabel = omittedLabel)
        }
        details()
    }
}
