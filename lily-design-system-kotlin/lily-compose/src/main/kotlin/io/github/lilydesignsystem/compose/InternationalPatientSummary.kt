// InternationalPatientSummary and InternationalPatientSummarySection (components/international-patient-summary*). Structure
// only: Lily parses no FHIR. The summary is a labelled traversal group: the banner, the contents (buttons that call back with
// a section key, for the app to scroll to it), the app's sections, an omitted section for each missing required one, then the
// details. A section is a traversal group under a heading(), with its status in words and an optional narrative Disclosure.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.IpsContentsEntry
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
        if (contentsLabel != null) SummaryContents(contentsLabel, contents, onSelectSection)
        content()
        contents.filter { it.added }.forEach { entry ->
            InternationalPatientSummarySection(entry.key, entry.heading, status = IpsSectionStatus.Omitted, statusLabel = omittedLabel)
        }
        details()
    }
}

/**
 * [InternationalPatientSummary] for a long summary: a [LazyColumn], so only the sections on screen are composed. The banner,
 * the contents, each section the app adds in [content], an omitted section for each missing required one, and the details are
 * items, in that order. The list is the traversal group named [label]. Same parameters and warnings as the eager form.
 *
 * @param state scroll it to a section's index from [onSelectSection]; the app knows which item its section is.
 * @param content the app's sections: `item { InternationalPatientSummarySection(...) { ... } }`, or `items(...)` inside one.
 */
@Composable
public fun InternationalPatientSummaryLazy(
    label: String,
    sections: List<IpsSectionEntry>,
    requiredHeadings: Map<String, String>,
    omittedLabel: String,
    modifier: Modifier = Modifier,
    state: LazyListState = rememberLazyListState(),
    contentPadding: PaddingValues = PaddingValues(0.dp),
    contentsLabel: String? = null,
    onSelectSection: (String) -> Unit = {},
    banner: @Composable () -> Unit = {},
    details: @Composable () -> Unit = {},
    content: LazyListScope.() -> Unit = {},
) {
    IpsRules.summaryWarnings(label, omittedLabel, requiredHeadings).forEach { LilyWarnings.warn(it) }
    val contents = ipsContents(sections, requiredHeadings)
    LazyColumn(
        modifier = modifier.semantics {
            isTraversalGroup = true
            contentDescription = label
        },
        state = state,
        contentPadding = contentPadding,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item { banner() }
        if (contentsLabel != null) item { SummaryContents(contentsLabel, contents, onSelectSection) }
        content()
        items(contents.filter { it.added }, key = { "omitted-" + it.key }) { entry ->
            InternationalPatientSummarySection(entry.key, entry.heading, status = IpsSectionStatus.Omitted, statusLabel = omittedLabel)
        }
        item { details() }
    }
}

@Composable
private fun SummaryContents(label: String, contents: List<IpsContentsEntry>, onSelectSection: (String) -> Unit) {
    Column(modifier = Modifier.semantics { isTraversalGroup = true; contentDescription = label }) {
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
