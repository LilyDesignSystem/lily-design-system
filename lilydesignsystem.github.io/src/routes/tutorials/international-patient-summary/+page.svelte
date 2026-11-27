<svelte:head>
  <title>International Patient Summary tutorial — Lily Design System</title>
  <meta name="description" content="Build a viewer for HL7 FHIR International Patient Summary documents, step by step, with SvelteKit and Lily, on the way to the open-source viewer." />
</svelte:head>

<section class="page-intro">
  <h1>International Patient Summary tutorial</h1>
  <p class="page-intro-tagline">Read a patient summary document, and show it without ever losing, guessing or hiding anything. You finish with a small working viewer, and the way to the full one.</p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>

  <p>A web page that opens an International Patient Summary (IPS): a short, standard document that says what a patient reacts to, what they take and what they have, so that someone treating them in another hospital or country can read it. It is an HL7 FHIR document, which is JSON. About 60 minutes.</p>

  <p>The full version is the open-source <a href="https://github.com/international-patient-summary/international-patient-summary">International Patient Summary viewer</a>, with a website at <a href="https://international-patient-summary.github.io/">international-patient-summary.github.io</a>. The last step shows how each part of yours grows into it.</p>

  <div class="callout">
    <p style="margin: 0;"><strong>For learning only.</strong> This is not a medical device. Use invented patients, never a real person's record.</p>
  </div>

  <h2>Before you start</h2>

  <p>You need Node 26, pnpm, and a little Svelte: the <a href="/tutorials/svelte/">Svelte tutorial</a> is enough. Make the app, then add Lily:</p>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npx sv create ips-viewer --template minimal --types ts --no-add-ons --install pnpm
cd ips-viewer
pnpm add @lilydesignsystem/svelte-headless @lilydesignsystem/themes
pnpm add -D @types/fhir vitest`}</code></pre>

  <p>Each code block below is one whole file, under the path shown above it. Copy it as it is, replacing the file if the new app already has one.</p>

  <h2>Step 1: Choose a theme</h2>

  <p>Lily's components have no styles of their own. A theme is one stylesheet.</p>

  <p><code>src/routes/+layout.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+layout.svelte"><code>{`<` + `script lang="ts">
  import "@lilydesignsystem/themes/light.css";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
<` + `/script>

{@render children()}`}</code></pre>

  <p>Run <code>pnpm dev</code> and open the address it prints. The page is plain, and styled.</p>

  <h2>Step 2: Invent a patient</h2>

  <p>A FHIR document is a bundle. Its first entry is a composition, the table of contents. Each section of the composition points to other entries by reference.</p>

  <p><code>src/lib/ips/example.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/ips/example.ts"><code>{`import type { Bundle, FhirResource } from "fhir/r4";

// An invented patient. Never use a real person's record in a demonstration.
export const example: Bundle<FhirResource> = {
  resourceType: "Bundle",
  type: "document",
  timestamp: "2026-11-03T09:00:00Z",
  identifier: { system: "urn:ietf:rfc:3986", value: "urn:uuid:11111111-0000-4000-8000-000000000001" },
  entry: [
    {
      fullUrl: "urn:uuid:composition",
      resource: {
        resourceType: "Composition",
        status: "final",
        language: "en-GB",
        type: { coding: [{ system: "http://loinc.org", code: "60591-5" }] },
        subject: { reference: "urn:uuid:patient" },
        date: "2026-11-03",
        author: [{ display: "Example General Practice" }],
        title: "Patient summary",
        section: [
          {
            title: "Allergies and intolerances",
            code: { coding: [{ system: "http://loinc.org", code: "48765-2" }] },
            entry: [{ reference: "urn:uuid:penicillin" }, { reference: "urn:uuid:latex" }],
          },
          {
            title: "Medication summary",
            code: { coding: [{ system: "http://loinc.org", code: "10160-0" }] },
            entry: [{ reference: "urn:uuid:metformin" }],
          },
          {
            title: "Problems",
            code: { coding: [{ system: "http://loinc.org", code: "11450-4" }] },
            emptyReason: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/list-empty-reason",
                  code: "unavailable",
                },
              ],
            },
          },
        ],
      },
    },
    {
      fullUrl: "urn:uuid:patient",
      resource: {
        resourceType: "Patient",
        name: [{ family: "Example", given: ["Alexandra"] }],
        birthDate: "1949-02-03",
        identifier: [{ system: "https://example.org/hospital-number", value: "EX-000123" }],
      },
    },
    {
      fullUrl: "urn:uuid:penicillin",
      resource: {
        resourceType: "AllergyIntolerance",
        patient: { reference: "urn:uuid:patient" },
        clinicalStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              code: "active",
            },
          ],
        },
        criticality: "high",
        code: { text: "Penicillin" },
        reaction: [{ manifestation: [{ text: "Anaphylaxis" }] }],
      },
    },
    {
      fullUrl: "urn:uuid:latex",
      resource: {
        resourceType: "AllergyIntolerance",
        patient: { reference: "urn:uuid:patient" },
        verificationStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
              code: "refuted",
            },
          ],
        },
        code: { text: "Latex" },
      },
    },
    {
      fullUrl: "urn:uuid:metformin",
      resource: {
        resourceType: "MedicationStatement",
        status: "active",
        subject: { reference: "urn:uuid:patient" },
        medicationCodeableConcept: { text: "metformin 500 mg tablet" },
        dosage: [{ text: "one tablet twice daily" }],
      },
    },
  ],
};`}</code></pre>

  <p>Two things here are easy to get wrong, and they are here so that you meet them:</p>

  <ul>
    <li>The latex allergy is <strong>refuted</strong>: someone checked, and it is not an allergy. Shown without that word, it would read as one.</li>
    <li>The problems section is empty, with a reason: <strong>unavailable</strong>. That is not the same as having no problems.</li>
  </ul>

  <h2>Step 3: Read the document</h2>

  <p>This is the heart of the viewer, and it has no user interface, so you can test all of it.</p>

  <p><code>src/lib/ips/summary.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/ips/summary.ts"><code>{`import type { Bundle, CodeableConcept, Composition, FhirResource, Patient } from "fhir/r4";

export type SectionKey = "allergies" | "medications" | "problems";
export type SectionStatus = "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";

export interface SummarySection {
  key: SectionKey;
  status: SectionStatus;
  entries: FhirResource[];
  /** References the document makes but does not carry. Say so; never drop them. */
  missing: string[];
  /** The document says none are known and lists some. The reader must be told. */
  conflict: boolean;
  /** Entries about someone else, or about no one. Never shown under this patient's banner; say how many. */
  otherSubject: string[];
}

export interface Summary {
  composition: Composition;
  patient: Patient;
  sections: SummarySection[];
  resolve: (reference: string | undefined) => FhirResource | undefined;
}

/** A document the viewer refuses, with a code the page turns into words. */
export class DocumentError extends Error {
  code: "notDocument" | "noComposition" | "noPatient";
  constructor(code: DocumentError["code"]) {
    super(code);
    this.code = code;
  }
}

// The three sections every International Patient Summary must have, by LOINC code.
const REQUIRED: Record<SectionKey, string> = {
  allergies: "48765-2",
  medications: "10160-0",
  problems: "11450-4",
};

const LOINC = "http://loinc.org";
const ABSENT = "http://hl7.org/fhir/uv/ips/CodeSystem/absent-unknown-uv-ips";
const EMPTY_REASON = "http://terminology.hl7.org/CodeSystem/list-empty-reason";

// A code is a system and a code together, in any of a concept's codings: their order means nothing.
const codeIn = (concept: CodeableConcept | undefined, system: string) =>
  concept?.coding?.find((coding) => coding.system === system && coding.code)?.code;
const has = (concept: CodeableConcept | undefined, system: string, code: string) =>
  concept?.coding?.some((coding) => coding.system === system && coding.code === code) ?? false;

// The statements about a whole section. A narrower one, such as "no known food allergies", is not here:
// it says nothing about medicines, so it is kept as an entry, with its own words.
const WHOLE: Record<SectionKey, Record<string, "none-known" | "not-recorded">> = {
  allergies: { "no-known-allergies": "none-known", "no-allergy-info": "not-recorded" },
  medications: { "no-known-medications": "none-known", "no-medication-info": "not-recorded" },
  problems: { "no-known-problems": "none-known", "no-problem-info": "not-recorded" },
};

const conceptOf = (resource: FhirResource) =>
  resource.resourceType === "MedicationStatement"
    ? resource.medicationCodeableConcept
    : resource.resourceType === "AllergyIntolerance" || resource.resourceType === "Condition"
      ? resource.code
      : undefined;

/** "No known allergies" is a statement someone made, so it is data, not an empty list. */
function absence(key: SectionKey, resource: FhirResource) {
  const code = codeIn(conceptOf(resource), ABSENT);
  return code ? WHOLE[key][code] : undefined;
}

/** Whose record an entry is: the patient of an allergy, the subject of a medicine or a problem. */
const subjectOf = (resource: FhirResource) =>
  resource.resourceType === "AllergyIntolerance"
    ? resource.patient?.reference
    : resource.resourceType === "MedicationStatement" || resource.resourceType === "Condition"
      ? resource.subject?.reference
      : undefined;

function emptyStatus(reason: CodeableConcept | undefined): SectionStatus {
  switch (codeIn(reason, EMPTY_REASON)) {
    case "nilknown":
      return "none-known";
    case "notasked":
    case "notstarted":
      return "not-recorded";
    case undefined:
      return "not-recorded";
    default:
      // "unavailable", "withheld", "closed", and any code this viewer does not know.
      return "unavailable";
  }
}

export function readSummary(data: unknown): Summary {
  const bundle = data as Bundle<FhirResource> | null;
  if (bundle?.resourceType !== "Bundle" || bundle.type !== "document")
    throw new DocumentError("notDocument");

  const resources = new Map<string, FhirResource>();
  for (const entry of bundle.entry ?? []) {
    if (!entry.resource) continue;
    if (entry.fullUrl) resources.set(entry.fullUrl, entry.resource);
    if (entry.resource.id)
      resources.set(\`\${entry.resource.resourceType}/\${entry.resource.id}\`, entry.resource);
  }

  const resolve = (reference: string | undefined) => resources.get(reference ?? "");

  const composition = bundle.entry?.[0]?.resource;
  if (composition?.resourceType !== "Composition") throw new DocumentError("noComposition");
  const patient = resolve(composition.subject?.reference);
  if (patient?.resourceType !== "Patient") throw new DocumentError("noPatient");

  const sections = (Object.keys(REQUIRED) as SectionKey[]).map((key): SummarySection => {
    const section = composition.section?.find((s) => has(s.code, LOINC, REQUIRED[key]));
    if (!section)
      return { key, status: "omitted", entries: [], missing: [], conflict: false, otherSubject: [] };

    const entries: FhirResource[] = [];
    const missing: string[] = [];
    const otherSubject: string[] = [];
    let said: SectionStatus | undefined;
    for (const { reference = "" } of section.entry ?? []) {
      const resource = resolve(reference);
      if (!resource) missing.push(reference);
      // The same patient by any reference resolves to the same resource; anyone else, or no one, is not shown here.
      else if (resolve(subjectOf(resource)) !== patient) otherSubject.push(reference);
      else if (absence(key, resource)) said = absence(key, resource);
      else entries.push(resource);
    }
    // Real entries win: a list that holds one is never "none known".
    const status: SectionStatus =
      entries.length > 0
        ? "known"
        : missing.length > 0 || otherSubject.length > 0
          ? "unavailable"
          : (said ?? emptyStatus(section.emptyReason));
    const conflict = entries.length > 0 && said === "none-known";
    return { key, status, entries, missing, conflict, otherSubject };
  });

  return { composition, patient, sections, resolve };
}`}</code></pre>

  <p>Four rules decide what is shown:</p>

  <ul>
    <li><strong>Absence has kinds.</strong> "None known", "not recorded", "unavailable" and "missing from the document" are four different facts. An empty list is never one of them by accident.</li>
    <li><strong>A statement is data.</strong> "No known allergies" is a code that a person recorded, so it is read as that and not as an allergy called "no known allergies".</li>
    <li><strong>Entries win, and the conflict is told.</strong> When a document says none are known and also lists one, the entry is shown, and so is a warning.</li>
    <li><strong>Nothing is dropped.</strong> A reference to something the document does not carry is kept, so that the page can say so.</li>
    <li><strong>A code is a system and a code.</strong> A concept can carry several codings in any order, so the reader looks for the one it knows, by system and code, never at the first. A statement about part of a section, such as "no known food allergies", is kept as an entry: it says nothing about medicines.</li>
    <li><strong>Every entry is checked for whose it is.</strong> An entry about someone else, or about no one, is never shown under this patient's banner. The page counts it, so the reader knows to check the source.</li>
  </ul>

  <h2>Step 4: Test the rules</h2>

  <p><code>src/lib/ips/summary.test.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/ips/summary.test.ts"><code>{`import { describe, expect, it } from "vitest";
import type { Bundle, Composition, FhirResource } from "fhir/r4";
import { example } from "./example.js";
import { DocumentError, readSummary, type SectionKey } from "./summary.js";

const copy = () => structuredClone(example);
const composition = (bundle: Bundle<FhirResource>) => bundle.entry![0].resource as Composition;
const section = (bundle: Bundle<FhirResource>, key: SectionKey) =>
  readSummary(bundle).sections.find((s) => s.key === key)!;

describe("readSummary", () => {
  it("reads the patient and the three required sections", () => {
    const summary = readSummary(example);
    expect(summary.patient.birthDate).toBe("1949-02-03");
    expect(summary.sections.map((s) => s.status)).toEqual(["known", "known", "unavailable"]);
  });

  it("says a required section is omitted, never hides it", () => {
    const bundle = copy();
    composition(bundle).section!.shift();
    expect(section(bundle, "allergies").status).toBe("omitted");
  });

  it("does not read an empty section as none known", () => {
    const bundle = copy();
    composition(bundle).section![0].entry = [];
    expect(section(bundle, "allergies").status).toBe("not-recorded");
  });

  it("reads a coded 'no known allergies' as none known", () => {
    const bundle = copy();
    bundle.entry!.push({
      fullUrl: "urn:uuid:none",
      resource: {
        resourceType: "AllergyIntolerance",
        patient: { reference: "urn:uuid:patient" },
        code: {
          coding: [
            {
              system: "http://hl7.org/fhir/uv/ips/CodeSystem/absent-unknown-uv-ips",
              code: "no-known-allergies",
            },
          ],
        },
      },
    });
    const allergies = composition(bundle).section![0];
    allergies.entry = [{ reference: "urn:uuid:none" }];
    expect(section(bundle, "allergies").status).toBe("none-known");

    // Both at once: the entries show, and the reader is told the document disagrees with itself.
    allergies.entry.push({ reference: "urn:uuid:penicillin" });
    expect(section(bundle, "allergies")).toMatchObject({ status: "known", conflict: true });
  });

  it("keeps a reference the document does not carry", () => {
    const bundle = copy();
    composition(bundle).section![0].entry = [{ reference: "urn:uuid:lost" }];
    expect(section(bundle, "allergies")).toMatchObject({
      status: "unavailable",
      missing: ["urn:uuid:lost"],
    });
  });

  it("keeps 'no known food allergies' beside a medicine allergy, never as none known", () => {
    const bundle = copy();
    bundle.entry!.push({
      fullUrl: "urn:uuid:no-food",
      resource: {
        resourceType: "AllergyIntolerance",
        patient: { reference: "urn:uuid:patient" },
        code: {
          coding: [
            {
              system: "http://hl7.org/fhir/uv/ips/CodeSystem/absent-unknown-uv-ips",
              code: "no-known-food-allergies",
              display: "No known food allergies",
            },
          ],
        },
      },
    });
    composition(bundle).section![0].entry = [{ reference: "urn:uuid:no-food" }];
    expect(section(bundle, "allergies")).toMatchObject({ status: "known", conflict: false });
    composition(bundle).section![0].entry!.push({ reference: "urn:uuid:penicillin" });
    expect(section(bundle, "allergies").entries).toHaveLength(2);
  });

  it("finds a section by its LOINC code in any coding, whatever comes first", () => {
    const bundle = copy();
    composition(bundle).section![0].code!.coding!.unshift({ system: "https://example.org/local", code: "ALG" });
    expect(section(bundle, "allergies")).toMatchObject({ status: "known" });
    expect(section(bundle, "allergies").entries).toHaveLength(2);
  });

  it("reads an empty reason only from its own code system", () => {
    const bundle = copy();
    composition(bundle).section![0].entry = [];
    composition(bundle).section![0].emptyReason = {
      coding: [{ system: "https://example.org/local", code: "nilknown" }],
    };
    expect(section(bundle, "allergies").status).toBe("not-recorded");
  });

  it("never shows another person's entry under this patient", () => {
    const bundle = copy();
    bundle.entry!.push({ fullUrl: "urn:uuid:someone-else", resource: { resourceType: "Patient" } });
    const penicillin = bundle.entry!.find((e) => e.fullUrl === "urn:uuid:penicillin")!;
    (penicillin.resource as { patient: { reference: string } }).patient.reference = "urn:uuid:someone-else";
    composition(bundle).section![0].entry = [{ reference: "urn:uuid:penicillin" }];
    expect(section(bundle, "allergies")).toMatchObject({
      status: "unavailable",
      entries: [],
      otherSubject: ["urn:uuid:penicillin"],
    });
  });

  it("accepts the same patient referred to another way", () => {
    const bundle = copy();
    const patient = bundle.entry!.find((e) => e.fullUrl === "urn:uuid:patient")!;
    patient.resource!.id = "ex-1";
    const penicillin = bundle.entry!.find((e) => e.fullUrl === "urn:uuid:penicillin")!;
    (penicillin.resource as { patient: { reference: string } }).patient.reference = "Patient/ex-1";
    expect(section(bundle, "allergies").otherSubject).toEqual([]);
    expect(section(bundle, "allergies").entries).toHaveLength(2);
  });

  it.each([
    ["not a document", {}, "notDocument"],
    ["no composition first", { resourceType: "Bundle", type: "document" }, "noComposition"],
  ])("refuses %s", (_name, data, code) => {
    expect(() => readSummary(data)).toThrow(expect.objectContaining({ code }));
    expect(() => readSummary(data)).toThrow(DocumentError);
  });
});`}</code></pre>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npx vitest run`}</code></pre>

  <div class="callout">
    <p style="margin: 0;"><strong>Check your work:</strong> twelve tests pass. Now make an empty section return "none-known" and run them again: one fails. That is the mistake that hurts people, and the test is what stops it.</p>
  </div>

  <h2>Step 5: Write the words</h2>

  <p>Lily ships no English. Every word on the page is yours, in one file, so a translator has one file to change.</p>

  <p><code>src/lib/words.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/words.ts"><code>{`// Every word the page says. Lily ships none, so a translation replaces this file.
import type { DocumentError, SectionKey, SectionStatus } from "./ips/summary.js";

export const locale = "en-GB";

export const headings: Record<SectionKey, string> = {
  allergies: "Allergies and intolerances",
  medications: "Medication summary",
  problems: "Problems",
};

export const statuses: Record<SectionStatus, string> = {
  known: "Recorded",
  "none-known": "None known",
  "not-recorded": "Not recorded",
  unavailable: "Not available. This does not mean there are none.",
  omitted: "Missing from this document. This does not mean there are none.",
};

export const conflict =
  "This document also says none are known. Check the source record before you rely on either.";
export const criticality = { high: "High risk", low: "Low risk", "unable-to-assess": "Risk not assessed" };
export const verification = {
  unconfirmed: "Unconfirmed",
  confirmed: "Confirmed",
  refuted: "Refuted: not an allergy",
  "entered-in-error": "Entered in error",
};
export const clinical = { active: "Active", inactive: "Inactive", resolved: "Resolved" };
export const medicine: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  "entered-in-error": "Entered in error",
  intended: "Intended",
  stopped: "Stopped",
  "on-hold": "On hold",
  unknown: "Status not known",
  "not-taken": "Not taken",
};
export const notShown = (type: string) =>
  \`An entry of type \${type}, which this viewer cannot show. See the source document.\`;

export const errors: Record<DocumentError["code"] | "notJson", string> = {
  notJson: "That file is not JSON.",
  notDocument: "That file is not a FHIR document.",
  noComposition: "The document does not start with a composition.",
  noPatient: "The document does not say who the patient is, so nothing is shown.",
};`}</code></pre>

  <h2>Step 6: Say whose record it is</h2>

  <p>The patient comes first, with more than one identifier: two people can share a name.</p>

  <p><code>src/lib/components/PatientBanner.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/PatientBanner.svelte"><code>{`<` + `script lang="ts">
  import { AgeView, ageParts, formatPartialDate, toIsoDuration } from "@lilydesignsystem/svelte-headless";
  import type { Patient } from "fhir/r4";
  import { locale } from "#lib/words.js";

  let { patient, today }: { patient: Patient; today: string } = $props();

  const name = $derived(
    [patient.name?.[0]?.family?.toUpperCase(), patient.name?.[0]?.given?.join(" ")]
      .filter(Boolean)
      .join(", ") || "Name not recorded",
  );
  // An age needs a whole date of birth, not after today: "1949" alone never becomes an invented birthday.
  const parts = $derived(
    /^\\d{4}-\\d{2}-\\d{2}$/.test(patient.birthDate ?? "") && patient.birthDate! <= today
      ? ageParts(patient.birthDate!, today)
      : [],
  );
  // Lily's units are plural ("years"); Intl's are singular.
  const age = $derived(
    parts
      .map(({ value, unit }) =>
        new Intl.NumberFormat(locale, {
          style: "unit",
          unit: unit.slice(0, -1),
          unitDisplay: "long",
        }).format(value),
      )
      .join(" "),
  );
<` + `/script>

<section class="patient-banner" aria-label={\`Patient details: \${name}\`}>
  <dl>
    <dt>Name</dt>
    <dd>{name}</dd>
    <dt>Born</dt>
    <dd>
      {#if patient.birthDate}
        <time datetime={patient.birthDate}>{formatPartialDate(patient.birthDate, locale)}</time>
        {#if age}(<AgeView value={age} duration={toIsoDuration(parts)} />){/if}
      {:else}
        Date of birth not recorded
      {/if}
    </dd>
    {#each patient.identifier ?? [] as identifier (identifier.system + "|" + identifier.value)}
      <dt>Identifier</dt>
      <dd>{identifier.value} <small>{identifier.system}</small></dd>
    {/each}
  </dl>
</section>`}</code></pre>

  <ul>
    <li><code>ageParts</code> refuses a partial date, because "1949" alone has no age. The page asks before it calls.</li>
    <li><code>formatPartialDate</code> writes only what the record has. It never invents a day.</li>
  </ul>

  <h2>Step 7: Show the entries</h2>

  <p>Each record list takes a <code>status</code>, and words for it.</p>

  <p><code>src/lib/components/Entries.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/Entries.svelte"><code>{`<` + `script lang="ts">
  import {
    AllergyRecordList,
    AllergyRecordListItem,
    MedicationRecordList,
    MedicationRecordListItem,
    MedicationView,
    ProblemRecordList,
    ProblemRecordListItem,
    RecordListItem,
  } from "@lilydesignsystem/svelte-headless";
  import type { CodeableConcept, MedicationStatement } from "fhir/r4";
  import type { Summary, SummarySection } from "#lib/ips/summary.js";
  import { clinical, conflict, criticality, medicine, notShown, statuses, verification } from "#lib/words.js";

  let { section, resolve }: { section: SummarySection; resolve: Summary["resolve"] } = $props();

  const UNNAMED = "Not named in the document";
  const words = (concept: CodeableConcept | undefined) =>
    concept?.text ?? concept?.coding?.find((c) => c.display)?.display ?? UNNAMED;

  /** A code we have words for. Any other code is not guessed at: the entry says it has none. */
  function known<T extends Record<string, string>>(table: T, concept: CodeableConcept | undefined) {
    const code = concept?.coding?.find((c) => c.code)?.code;
    return code && code in table ? (code as keyof T & string) : undefined;
  }

  function medicineName(entry: MedicationStatement) {
    const resource = resolve(entry.medicationReference?.reference);
    return words(resource?.resourceType === "Medication" ? resource.code : entry.medicationCodeableConcept);
  }

  const statusLabel = $derived(statuses[section.status]);
<` + `/script>

{#snippet other(type: string)}
  <RecordListItem>{notShown(type)}</RecordListItem>
{/snippet}

{#if section.conflict}<p role="note"><strong>{conflict}</strong></p>{/if}

{#if section.key === "allergies"}
  <AllergyRecordList status={section.status} {statusLabel}>
    {#each section.entries as entry, i (i)}
      {#if entry.resourceType === "AllergyIntolerance"}
        {@const verified = known(verification, entry.verificationStatus)}
        {@const state = known(clinical, entry.clinicalStatus)}
        <AllergyRecordListItem
          substance={words(entry.code)}
          reaction={entry.reaction?.flatMap((r) => r.manifestation.map(words)).join(", ")}
          criticality={entry.criticality}
          criticalityLabel={entry.criticality && criticality[entry.criticality]}
          verificationStatus={verified}
          verificationStatusLabel={verified && verification[verified]}
          clinicalStatus={state}
          clinicalStatusLabel={state && clinical[state]}
        />
      {:else}
        {@render other(entry.resourceType)}
      {/if}
    {/each}
  </AllergyRecordList>
{:else if section.key === "medications"}
  <MedicationRecordList status={section.status} {statusLabel}>
    {#each section.entries as entry, i (i)}
      {#if entry.resourceType === "MedicationStatement"}
        <MedicationRecordListItem status={entry.status} statusLabel={medicine[entry.status]}>
          <MedicationView
            name={medicineName(entry)}
            dosageText={entry.dosage?.map((d) => d.text).filter(Boolean).join("; ")}
          />
        </MedicationRecordListItem>
      {:else}
        {@render other(entry.resourceType)}
      {/if}
    {/each}
  </MedicationRecordList>
{:else}
  <ProblemRecordList status={section.status} {statusLabel}>
    {#each section.entries as entry, i (i)}
      {#if entry.resourceType === "Condition"}
        {@const verified = known(verification, entry.verificationStatus)}
        {@const state = known(clinical, entry.clinicalStatus)}
        <ProblemRecordListItem
          condition={words(entry.code)}
          verificationStatus={verified}
          verificationStatusLabel={verified && verification[verified]}
          clinicalStatus={state}
          clinicalStatusLabel={state && clinical[state]}
        />
      {:else}
        {@render other(entry.resourceType)}
      {/if}
    {/each}
  </ProblemRecordList>
{/if}

{#if section.missing.length > 0}
  <p>Entries this document names but does not include: {section.missing.length}.</p>
{/if}
{#if section.otherSubject.length > 0}
  <p>Entries about someone else, or about no one, not shown here: {section.otherSubject.length}. Check the source document.</p>
{/if}`}</code></pre>

  <p>An entry of a type this viewer does not know still appears, and says so. Your viewer will meet documents you did not write.</p>

  <h2>Step 8: Put the page together</h2>

  <p><code>InternationalPatientSummary</code> gives the document its structure: the banner, a contents list, the sections and the details. If you leave out a section the IPS requires, it adds the section and says that it is missing.</p>

  <p><code>src/routes/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+page.svelte"><code>{`<` + `script lang="ts">
  import {
    InternationalPatientSummary,
    InternationalPatientSummarySection,
  } from "@lilydesignsystem/svelte-headless";
  import Entries from "#lib/components/Entries.svelte";
  import PatientBanner from "#lib/components/PatientBanner.svelte";
  import { example } from "#lib/ips/example.js";
  import { DocumentError, readSummary, type Summary } from "#lib/ips/summary.js";
  import { errors, headings, locale, statuses } from "#lib/words.js";

  // In memory only: never in storage, a URL or a log.
  let summary = $state.raw<Summary | undefined>();
  let error = $state("");
  // The reader's own calendar day: a UTC date is tomorrow, or yesterday, near midnight.
  const now = new Date();
  const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("-");

  function show(read: () => unknown) {
    summary = undefined;
    error = "";
    try {
      summary = readSummary(read());
    } catch (e) {
      error = errors[e instanceof DocumentError ? e.code : "notJson"];
    }
  }

  async function choose(event: Event & { currentTarget: HTMLInputElement }) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const text = await file.text();
    show(() => JSON.parse(text));
  }
<` + `/script>

<svelte:head><title>Patient summary viewer</title></svelte:head>

<main>
  <h1>Patient summary viewer</h1>
  <p>For learning. Not a medical device: check every decision against the source record.</p>

  <p>
    <label for="file">Open a summary (FHIR JSON)</label>
    <input id="file" type="file" accept=".json,application/json" onchange={choose} />
  </p>
  <button class="button" type="button" onclick={() => show(() => example)}>Open the example</button>
  <p role="alert">{error}</p>

  {#if summary}
    <InternationalPatientSummary
      label="Patient summary"
      contentsLabel="Contents"
      omittedLabel={statuses.omitted}
      requiredHeadings={headings}
      sections={summary.sections.map(({ key, status }) => ({ key, heading: headings[key], status }))}
      lang={summary.composition.language}
    >
      {#snippet banner()}
        <PatientBanner patient={summary!.patient} {today} />
      {/snippet}
      {#each summary.sections as section (section.key)}
        <InternationalPatientSummarySection
          section={section.key}
          heading={headings[section.key]}
          status={section.status}
          statusLabel={section.status === "known" ? undefined : statuses[section.status]}
          statusPlacement="list"
        >
          <Entries {section} resolve={summary.resolve} />
        </InternationalPatientSummarySection>
      {/each}
      {#snippet details()}
        <h2>About this document</h2>
        <dl>
          <dt>Written by</dt>
          <dd>{summary!.composition.author.map((a) => a.display).join(", ") || "Not recorded"}</dd>
          <dt>Date</dt>
          <dd><time datetime={summary!.composition.date}>{summary!.composition.date}</time></dd>
        </dl>
      {/snippet}
    </InternationalPatientSummary>
  {/if}
</main>`}</code></pre>

  <p>The document stays in memory. It is not in storage, in the address or in a log, so closing the tab is enough to forget it.</p>

  <div class="callout">
    <p style="margin: 0;"><strong>Check your work:</strong> choose "Open the example". The latex entry says "Refuted: not an allergy". The problems section says that nothing being shown does not mean there are none. Open a file that is not JSON: the last patient disappears, and the page says why. Then try it all with the keyboard alone, and at 320 pixels wide.</p>
  </div>

  <h2>From here to the full viewer</h2>

  <p>You have the core of the real thing. Each part has a larger twin in the <a href="https://github.com/international-patient-summary/international-patient-summary">open-source viewer</a>:</p>

  <ul>
    <li><strong>Reading a file</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/fhir/parse.ts">parse.ts</a> also reads YAML, limits the size, and says which line is wrong.</li>
    <li><strong>The document</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/fhir/composition.ts">composition.ts</a> reads every section and reports what it checked.</li>
    <li><strong>Sections</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/fhir/sections.ts">sections.ts</a> has all sixteen, with their LOINC codes. Yours has the three required ones.</li>
    <li><strong>Absence</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/fhir/absent.ts">absent.ts</a> also knows the SNOMED CT codes for "none known".</li>
    <li><strong>Narrative</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/fhir/narrative.ts">narrative.ts</a> cleans a document's own HTML before showing it. Yours shows none, which is safe. Never put a document's HTML on a page without this.</li>
    <li><strong>The banner</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/components/PatientBanner.svelte">PatientBanner.svelte</a> puts allergies and alerts beside the name.</li>
    <li><strong>Export</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/export/pdf.ts">pdf.ts</a> writes one page to carry.</li>
    <li><strong>A server</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/src/lib/service/service.ts">service.ts</a> is the contract with the project's Rust service.</li>
    <li><strong>The rules, written down</strong>: <a href="https://github.com/international-patient-summary/international-patient-summary/blob/main/international-patient-summary-ui-with-svelte/spec/index.md">the specification</a>.</li>
  </ul>

  <p>A good next step is to add the immunizations section to yours, with a test first, and then compare it with theirs.</p>

  <h2>Next steps</h2>

  <ul>
    <li><a href="/tutorials/electronic-patient-record/">Electronic patient record tutorial</a>: record what a summary is made from.</li>
    <li><a href="/tutorials/patient-administration-system/">Patient administration system tutorial</a>: appointments, waiting lists and reminders.</li>
    <li><a href="/patterns/healthcare/">Healthcare patterns</a>: the rules behind these components, and the map from FHIR to Lily.</li>
    <li><a href="/tutorials/pre-operative-assessment-by-patient/">Pre-operative assessment by patient tutorial</a>: the questions a patient answers before an operation.</li>
  </ul>
</section>
