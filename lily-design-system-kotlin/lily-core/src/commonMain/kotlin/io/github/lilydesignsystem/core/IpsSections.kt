// The Kotlin port of shared/ips-sections.ts, proved equal by shared/vectors/ips-sections.json. The sixteen IPS 2.0.1
// Composition sections with their LOINC codes and levels; a summary shows a missing required section rather than hiding it.
package io.github.lilydesignsystem.core

public enum class IpsSectionStatus(public val key: String) {
    Known("known"), NoneKnown("none-known"), NotRecorded("not-recorded"), Unavailable("unavailable"), Omitted("omitted");

    public companion object {
        public fun fromKey(key: String): IpsSectionStatus? = entries.firstOrNull { it.key == key }
    }
}

public enum class IpsSectionLevel { Required, Recommended, Optional }

public data class IpsSectionDefinition(val key: String, val code: String, val level: IpsSectionLevel)

/** One section the app renders, as plain data. */
public data class IpsSectionEntry(
    val key: String,
    val heading: String,
    val status: IpsSectionStatus? = null,
    val id: String? = null,
)

public data class IpsContentsEntry(
    val key: String,
    val heading: String,
    val status: IpsSectionStatus,
    val id: String,
    val code: String?,
    val required: Boolean,
    /** True when the summary added it because the app's list lacked a required section. */
    val added: Boolean,
)

/** The IPS 2.0.1 Composition sections, in the IG's order. */
public val IPS_SECTIONS: List<IpsSectionDefinition> = listOf(
    IpsSectionDefinition("medications", "10160-0", IpsSectionLevel.Required),
    IpsSectionDefinition("allergies", "48765-2", IpsSectionLevel.Required),
    IpsSectionDefinition("problems", "11450-4", IpsSectionLevel.Required),
    IpsSectionDefinition("immunizations", "11369-6", IpsSectionLevel.Recommended),
    IpsSectionDefinition("results", "30954-2", IpsSectionLevel.Recommended),
    IpsSectionDefinition("procedures", "47519-4", IpsSectionLevel.Recommended),
    IpsSectionDefinition("devices", "46264-8", IpsSectionLevel.Recommended),
    IpsSectionDefinition("vital-signs", "8716-3", IpsSectionLevel.Optional),
    IpsSectionDefinition("past-illness", "11348-0", IpsSectionLevel.Optional),
    IpsSectionDefinition("functional-status", "47420-5", IpsSectionLevel.Optional),
    IpsSectionDefinition("plan-of-care", "18776-5", IpsSectionLevel.Optional),
    IpsSectionDefinition("social-history", "29762-2", IpsSectionLevel.Optional),
    IpsSectionDefinition("pregnancy", "10162-6", IpsSectionLevel.Optional),
    IpsSectionDefinition("advance-directives", "42348-3", IpsSectionLevel.Optional),
    IpsSectionDefinition("alerts", "104605-1", IpsSectionLevel.Optional),
    IpsSectionDefinition("patient-story", "81338-6", IpsSectionLevel.Optional),
)

/** The keys of the three required sections, in registry order. */
public val IPS_REQUIRED_SECTIONS: List<String> = IPS_SECTIONS.filter { it.level == IpsSectionLevel.Required }.map { it.key }

/** The default id prefix; give each summary on a screen its own. */
public const val IPS_ID_PREFIX: String = "international-patient-summary"

public fun ipsSectionCode(key: String): String? = IPS_SECTIONS.firstOrNull { it.key == key }?.code

public fun ipsSectionIsRequired(key: String): Boolean = key in IPS_REQUIRED_SECTIONS

public fun ipsSectionId(key: String, id: String? = null, idPrefix: String = IPS_ID_PREFIX): String =
    if (!id.isNullOrEmpty()) id else "${idPrefix.ifEmpty { IPS_ID_PREFIX }}-$key"

/** The required section keys the app's list lacks, in registry order. */
public fun ipsMissingRequired(keys: List<String>): List<String> = IPS_REQUIRED_SECTIONS.filter { it !in keys }

/** The contents in the app's order, then an "omitted" entry for each missing required section, headed by the app's words. */
public fun ipsContents(
    sections: List<IpsSectionEntry>,
    requiredHeadings: Map<String, String>,
    idPrefix: String = IPS_ID_PREFIX,
): List<IpsContentsEntry> {
    val given = sections.map {
        IpsContentsEntry(it.key, it.heading, it.status ?: IpsSectionStatus.Known, ipsSectionId(it.key, it.id, idPrefix),
            ipsSectionCode(it.key), ipsSectionIsRequired(it.key), added = false)
    }
    val added = ipsMissingRequired(sections.map { it.key }).map {
        IpsContentsEntry(it, requiredHeadings[it] ?: "", IpsSectionStatus.Omitted, ipsSectionId(it, idPrefix = idPrefix),
            ipsSectionCode(it), required = true, added = true)
    }
    return given + added
}

/** Where a section says a status other than known in words: under its heading, or in the record list inside it. */
public enum class IpsStatusPlacement { Heading, List }

public object IpsRules {
    /** Whether a section shows its status line under the heading. */
    public fun showsStatusLine(status: IpsSectionStatus, placement: IpsStatusPlacement): Boolean =
        status != IpsSectionStatus.Known && placement == IpsStatusPlacement.Heading

    public fun sectionWarnings(
        heading: String,
        status: IpsSectionStatus,
        statusLabel: String?,
        placement: IpsStatusPlacement,
        hasNarrative: Boolean,
        narrativeLabel: String?,
    ): List<String> = buildList {
        if (heading.isEmpty()) add("InternationalPatientSummarySection: a heading is required")
        if (showsStatusLine(status, placement) && statusLabel.isNullOrEmpty()) {
            add("InternationalPatientSummarySection: status ${status.key} needs a statusLabel")
        }
        if (hasNarrative && narrativeLabel.isNullOrEmpty()) add("InternationalPatientSummarySection: a narrative needs a narrativeLabel")
    }

    public fun summaryWarnings(label: String, omittedLabel: String, requiredHeadings: Map<String, String>): List<String> = buildList {
        if (label.isEmpty()) add("InternationalPatientSummary: a label is required")
        if (omittedLabel.isEmpty()) add("InternationalPatientSummary: an omittedLabel is required")
        IPS_REQUIRED_SECTIONS.filter { requiredHeadings[it].isNullOrEmpty() }
            .forEach { add("InternationalPatientSummary: requiredHeadings needs $it") }
    }
}
