<svelte:head>
  <title>Pre-operative assessment by patient tutorial — Lily Design System</title>
  <meta name="description" content="Build a short questionnaire a patient fills in before an operation, step by step, with SvelteKit and Lily: questions answered yes, no or not sure, lists of medicines and allergies, a saved draft, and what the clinic looks at first." />
</svelte:head>

<section class="page-intro">
  <h1>Pre-operative assessment by patient tutorial</h1>
  <p class="page-intro-tagline">Build the questions a patient answers before an operation, so the clinic knows what to look at first. You finish with a small working app, and the way to the full project.</p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>

  <p>A short pre-operative questionnaire in five steps: about you, heart and lungs, medicines, allergies, and anaesthetics. The patient checks their answers and sends them, and the clinic sees what to look at first. The answers are saved on the device as the patient goes, so a closed tab loses nothing. About 60 minutes.</p>

  <p>It leads to the open-source <a href="https://github.com/FormExamples/form-examples">Form Examples</a>, whose <a href="https://github.com/FormExamples/form-examples/tree/main/forms/pre-operative-assessment-by-patient">pre-operative assessment by patient</a> form asks sixteen steps of questions and has a data model, an API and a back end, beside its <a href="https://github.com/FormExamples/form-examples/tree/main/forms/pre-operative-assessment-by-clinician">clinician counterpart</a>. It describes itself as a clinical decision-support tool: read its <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-patient/doc/clinical-safety-case.md">clinical safety case</a> before you rely on any of it.</p>

  <div class="callout">
    <p style="margin: 0;"><strong>For learning only.</strong> Not for clinical use. Use invented answers, never a real person's details.</p>
  </div>

  <h2>Before you start</h2>

  <p>You need Node 26, pnpm, and a little Svelte: the <a href="/tutorials/svelte/">Svelte tutorial</a> is enough. The <a href="/tutorials/forms/">forms tutorial</a> helps too. Make the app, then add Lily:</p>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npx sv create pre-op --template minimal --types ts --no-add-ons --install pnpm
cd pre-op
pnpm add @lilydesignsystem/svelte-headless @lilydesignsystem/themes
pnpm add -D vitest`}</code></pre>

  <p>Each code block below is one whole file, under the path shown above it. Copy it as it is, replacing the file if the new app already has one.</p>

  <h2>Step 1: Choose a theme</h2>

  <p>The answers live in the browser, so the pages are drawn there too: <code>ssr = false</code>.</p>

  <p><code>src/routes/+layout.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+layout.svelte"><code>{`<` + `script lang="ts">
  import "@lilydesignsystem/themes/light.css";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
<` + `/script>

{@render children()}`}</code></pre>

  <p><code>src/routes/+layout.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+layout.ts"><code>{`// The answers live in the browser, so the pages are drawn there too.
export const ssr = false;`}</code></pre>

  <h2>Step 2: Describe the answers</h2>

  <p>Every question starts unanswered, <code>""</code>, which is not the same as <code>"no"</code>. A patient may not know, so every yes-or-no question also takes <code>"not-sure"</code>. Medicines and allergies are asked first as a question, then as a list: an empty list could mean "none" or "not answered yet", and the clinic must know which.</p>

  <p><code>src/lib/answers.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/answers.ts"><code>{`// What the patient says. Every question starts unanswered (""), which is not the same as "no".

export type Answer = "" | "yes" | "no" | "not-sure";

export interface Medicine {
  name: string;
  dose: string;
}

export interface Allergy {
  substance: string;
  reaction: string;
  /** Did it ever make it hard to breathe, or swell the face or throat? */
  severe: Answer;
}

export interface Answers {
  /** YYYY-MM-DD once all three parts are filled, else "". */
  birthDate: string;
  weight: { magnitude: string; unit: string };
  height: { magnitude: string; unit: string };
  operation: string;
  /** Asked of everyone: "no" covers anyone who cannot be. */
  couldBePregnant: Answer;
  highBloodPressure: Answer;
  breathlessOnStairs: Answer;
  bloodThinner: Answer;
  /** Asked only when bloodThinner is "yes". */
  bloodThinnerName: string;
  anyMedicines: Answer;
  /** Asked only when anyMedicines is "yes". */
  medicines: Medicine[];
  anyAllergies: Answer;
  /** Asked only when anyAllergies is "yes". */
  allergies: Allergy[];
  anaesthesiaBefore: Answer;
  /** Asked only when anaesthesiaBefore is "yes". */
  anaesthesiaProblem: Answer;
  /** Asked only when anaesthesiaProblem is "yes". */
  anaesthesiaProblemDetails: string;
  familyAnaesthesiaProblem: Answer;
}

export function blank(): Answers {
  return {
    birthDate: "",
    weight: { magnitude: "", unit: "kg" },
    height: { magnitude: "", unit: "cm" },
    operation: "",
    couldBePregnant: "",
    highBloodPressure: "",
    breathlessOnStairs: "",
    bloodThinner: "",
    bloodThinnerName: "",
    anyMedicines: "",
    medicines: [],
    anyAllergies: "",
    allergies: [],
    anaesthesiaBefore: "",
    anaesthesiaProblem: "",
    anaesthesiaProblemDetails: "",
    familyAnaesthesiaProblem: "",
  };
}`}</code></pre>

  <h2>Step 3: Write the rules</h2>

  <p>The rules are pure functions, written before any page. None of them grades the patient. The ASA physical status grade is the anaesthetist's to assign, from these answers and their own findings, so the patient never sees one. The rules say four things:</p>

  <ul>
    <li><strong>The body mass index</strong>, in whichever units the patient used.</li>
    <li><strong>What is sent.</strong> A follow-up the patient can no longer see, because they changed the answer above it, is left out.</li>
    <li><strong>What is missing</strong> from each step, including a date of birth that is not a real day or is still to come. The date field checks only that its parts are numbers, so 31 February is the app's to refuse, against the clinic's today in the clinic's time zone.</li>
    <li><strong>What the clinic should look at first</strong>, from what is sent, so an answer the patient took back never raises a flag.</li>
  </ul>

  <p><code>src/lib/rules.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/rules.ts"><code>{`import type { Answer, Answers } from "./answers.js";

// The rules, as pure functions with tests. None of them grades the patient: the anaesthetist assigns the ASA grade, from these
// answers and their own findings. These say what to send, what is missing, and what the clinic should look at first.

const POUND = 0.45359237;
const INCH = 0.0254;

/** Weight in kilograms, or undefined when it is not a number above zero. */
export function kilograms(weight: Answers["weight"]): number | undefined {
  const n = Number(weight.magnitude);
  if (weight.magnitude === "" || !(n > 0)) return undefined;
  return weight.unit === "lb" ? n * POUND : n;
}

/** Height in metres, or undefined when it is not a number above zero. */
export function metres(height: Answers["height"]): number | undefined {
  const n = Number(height.magnitude);
  if (height.magnitude === "" || !(n > 0)) return undefined;
  return height.unit === "in" ? n * INCH : n / 100;
}

/** Body mass index to one decimal place, or undefined without both measurements. */
export function bmi(a: Answers): number | undefined {
  const kg = kilograms(a.weight);
  const m = metres(a.height);
  if (kg === undefined || m === undefined) return undefined;
  return Math.round((kg / (m * m)) * 10) / 10;
}

/** What is sent: an answer the patient can no longer see is left out, and so is an entry with no name. */
export function sent(a: Answers): Answers {
  const anaesthesiaProblem = a.anaesthesiaBefore === "yes" ? a.anaesthesiaProblem : "";
  return {
    ...a,
    bloodThinnerName: a.bloodThinner === "yes" ? a.bloodThinnerName : "",
    medicines: a.anyMedicines === "yes" ? a.medicines.filter((m) => m.name.trim() !== "") : [],
    allergies: a.anyAllergies === "yes" ? a.allergies.filter((x) => x.substance.trim() !== "") : [],
    anaesthesiaProblem,
    anaesthesiaProblemDetails: anaesthesiaProblem === "yes" ? a.anaesthesiaProblemDetails : "",
  };
}

/** What the allergy answers say: an empty list is never "none known"; only a "No" is. */
export function allergyStatus(a: Answers): "known" | "none-known" | "not-recorded" {
  const s = sent(a);
  if (s.anyAllergies === "no") return "none-known";
  return s.allergies.length > 0 ? "known" : "not-recorded";
}

/** Today, YYYY-MM-DD, in the clinic's time zone: a date of birth is checked against the clinic's day, not the server's. */
export function today(timeZone: string, now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return \`\${part("year")}-\${part("month")}-\${part("day")}\`;
}

/** Whether a date of birth is a real day on or before today. The date field checks only that its parts are numbers. */
export function isBirthDate(iso: string, onOrBefore: string): boolean {
  const m = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(iso);
  if (!m) return false;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  const real = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return real && iso <= onOrBefore;
}

export type Section = "about" | "heart" | "medicines" | "allergies" | "anaesthesia";

/** The questions in a section that still need an answer, by the id of their field. \`on\` is today, from \`today\`. */
export function missing(section: Section, a: Answers, on: string): string[] {
  const need = (id: string, answered: boolean) => (answered ? [] : [id]);
  switch (section) {
    case "about":
      return [
        ...need("birth-date", isBirthDate(a.birthDate, on)),
        ...need("weight", kilograms(a.weight) !== undefined),
        ...need("height", metres(a.height) !== undefined),
        ...need("operation", a.operation.trim() !== ""),
        ...need("could-be-pregnant", a.couldBePregnant !== ""),
      ];
    case "heart":
      return [
        ...need("high-blood-pressure", a.highBloodPressure !== ""),
        ...need("breathless-on-stairs", a.breathlessOnStairs !== ""),
        ...need("blood-thinner", a.bloodThinner !== ""),
      ];
    case "medicines":
      return [
        ...need("any-medicines", a.anyMedicines !== ""),
        ...need("medicine-list", a.anyMedicines !== "yes" || sent(a).medicines.length > 0),
      ];
    case "allergies":
      return [
        ...need("any-allergies", a.anyAllergies !== ""),
        ...need("allergy-list", a.anyAllergies !== "yes" || sent(a).allergies.length > 0),
      ];
    case "anaesthesia":
      return [
        ...need("anaesthesia-before", a.anaesthesiaBefore !== ""),
        ...need("anaesthesia-problem", a.anaesthesiaBefore !== "yes" || a.anaesthesiaProblem !== ""),
        ...need("family-anaesthesia-problem", a.familyAnaesthesiaProblem !== ""),
      ];
  }
}

export type Flag =
  | "severe-allergy"
  | "blood-thinner"
  | "anaesthesia-problem"
  | "family-anaesthesia-problem"
  | "could-be-pregnant"
  | "breathless-on-stairs"
  | "bmi-40-or-more"
  | "not-sure";

/** What the clinic should look at first, high priority first. From what is sent, so a hidden answer never raises one. */
export function flags(a: Answers): Flag[] {
  const s = sent(a);
  const unsure: Answer[] = [
    s.couldBePregnant,
    s.highBloodPressure,
    s.breathlessOnStairs,
    s.bloodThinner,
    s.anyMedicines,
    s.anyAllergies,
    s.anaesthesiaBefore,
    s.anaesthesiaProblem,
    s.familyAnaesthesiaProblem,
    ...s.allergies.map((x) => x.severe),
  ];
  const index = bmi(s);
  return [
    ...(s.allergies.some((x) => x.severe === "yes") ? (["severe-allergy"] as const) : []),
    ...(s.anaesthesiaProblem === "yes" ? (["anaesthesia-problem"] as const) : []),
    ...(s.familyAnaesthesiaProblem === "yes" ? (["family-anaesthesia-problem"] as const) : []),
    ...(s.bloodThinner === "yes" ? (["blood-thinner"] as const) : []),
    ...(s.couldBePregnant === "yes" || s.couldBePregnant === "not-sure"
      ? (["could-be-pregnant"] as const)
      : []),
    ...(s.breathlessOnStairs === "yes" ? (["breathless-on-stairs"] as const) : []),
    ...(index !== undefined && index >= 40 ? (["bmi-40-or-more"] as const) : []),
    ...(unsure.includes("not-sure") ? (["not-sure"] as const) : []),
  ];
}`}</code></pre>

  <h2>Step 4: Test the rules</h2>

  <p><code>src/lib/rules.test.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/rules.test.ts"><code>{`import { describe, expect, it } from "vitest";
import { blank, type Answers } from "./answers.js";
import { allergyStatus, bmi, flags, isBirthDate, missing, sent } from "./rules.js";

const with_ = (change: Partial<Answers>): Answers => ({ ...blank(), ...change });

describe("bmi", () => {
  it("works in kilograms and centimetres", () => {
    expect(bmi(with_({ weight: { magnitude: "70", unit: "kg" }, height: { magnitude: "175", unit: "cm" } }))).toBe(22.9);
  });

  it("works in pounds and inches, the same person", () => {
    expect(bmi(with_({ weight: { magnitude: "154.3", unit: "lb" }, height: { magnitude: "68.9", unit: "in" } }))).toBe(22.9);
  });

  it("is undefined without both measurements", () => {
    expect(bmi(with_({ weight: { magnitude: "70", unit: "kg" } }))).toBeUndefined();
  });
});

describe("sent", () => {
  it("leaves out a follow-up the patient took back", () => {
    const a = with_({ bloodThinner: "no", bloodThinnerName: "warfarin" });
    expect(sent(a).bloodThinnerName).toBe("");
  });

  it("keeps a follow-up that is still asked", () => {
    const a = with_({ bloodThinner: "yes", bloodThinnerName: "warfarin" });
    expect(sent(a).bloodThinnerName).toBe("warfarin");
  });

  it("leaves out medicines listed before the answer became no", () => {
    const a = with_({ anyMedicines: "no", medicines: [{ name: "Ramipril", dose: "5 mg daily" }] });
    expect(sent(a).medicines).toEqual([]);
  });

  it("leaves out allergies listed before the answer became no", () => {
    const a = with_({ anyAllergies: "no", allergies: [{ substance: "Penicillin", reaction: "Rash", severe: "no" }] });
    expect(sent(a).allergies).toEqual([]);
  });
});

describe("allergyStatus", () => {
  it("is none known only when the patient says no", () => {
    expect(allergyStatus(with_({ anyAllergies: "no" }))).toBe("none-known");
  });

  it("is not recorded when the question is unanswered, though the list is empty", () => {
    expect(allergyStatus(with_({ anyAllergies: "" }))).toBe("not-recorded");
    expect(allergyStatus(with_({ anyAllergies: "not-sure" }))).toBe("not-recorded");
  });
});

describe("missing", () => {
  it("asks again for a date of birth that is not a real day, or is still to come", () => {
    expect(isBirthDate("1949-02-03", "2026-11-27")).toBe(true);
    expect(isBirthDate("1949-02-31", "2026-11-27")).toBe(false);
    expect(isBirthDate("2027-01-01", "2026-11-27")).toBe(false);
  });

  it("asks for an allergy when the answer is yes and the list is empty", () => {
    expect(missing("allergies", with_({ anyAllergies: "yes" }), "2026-11-27")).toEqual(["allergy-list"]);
  });

  it("asks what went wrong only after a previous anaesthetic", () => {
    expect(missing("anaesthesia", with_({ anaesthesiaBefore: "no", familyAnaesthesiaProblem: "no" }), "2026-11-27")).toEqual([]);
    expect(missing("anaesthesia", with_({ anaesthesiaBefore: "yes", familyAnaesthesiaProblem: "no" }), "2026-11-27")).toEqual([
      "anaesthesia-problem",
    ]);
  });
});

describe("flags", () => {
  it("puts a severe allergy first", () => {
    const a = with_({
      bloodThinner: "yes",
      anyAllergies: "yes",
      allergies: [{ substance: "Penicillin", reaction: "Throat swelling", severe: "yes" }],
    });
    expect(flags(a)).toEqual(["severe-allergy", "blood-thinner"]);
  });

  it("never flags an answer the patient can no longer see", () => {
    const a = with_({ anaesthesiaBefore: "no", anaesthesiaProblem: "yes" });
    expect(flags(a)).toEqual([]);
  });

  it("asks the clinic to follow up a not sure, and a possible pregnancy", () => {
    expect(flags(with_({ couldBePregnant: "not-sure" }))).toEqual(["could-be-pregnant", "not-sure"]);
  });
});`}</code></pre>

  <p>Run <code>npx vitest run</code>: 15 tests pass. Now break the rules, one at a time, and watch a test fail each time:</p>

  <ul>
    <li>In <code>allergyStatus</code>, return <code>"none-known"</code> when the list is empty rather than when the patient says no.</li>
    <li>In <code>sent</code>, send <code>bloodThinnerName</code> whatever the answer above it.</li>
    <li>Make <code>POUND</code> 1, as if every weight were in kilograms.</li>
    <li>In <code>flags</code>, read the answers as typed, <code>a</code>, rather than as sent.</li>
  </ul>

  <h2>Step 5: Write the words</h2>

  <p>Every word the app shows is in one file, so translating the app touches no component. The order of a date's parts and the units are the reader's too: change <code>dateOrder</code> to <code>"mdy"</code> for a reader in the United States.</p>

  <p><code>src/lib/words.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/words.ts"><code>{`import type { Answer } from "./answers.js";
import type { Flag } from "./rules.js";

// Every word the app shows, in one place, so the app can be translated without touching a component.

export const words = {
  /** The language the app writes in, for Intl. */
  locale: "en-GB",
  /** The clinic's time zone, IANA: whose "today" a date of birth is checked against. */
  timeZone: "Europe/London",
  title: "Before your operation",
  intro: "These questions help the team plan your anaesthetic. The clinic reads your answers before your assessment.",
  saved: "Your answers are saved on this device as you go.",
  restored: "We filled in the answers you saved on this device.",
  keep: "Keep my answers",
  startAgain: "Start again",
  steps: "Questions",
  stepNames: {
    about: "About you",
    heart: "Heart and lungs",
    medicines: "Medicines",
    allergies: "Allergies",
    anaesthesia: "Anaesthetics",
    check: "Check your answers",
  },
  back: "Back",
  next: "Continue",
  send: "Send to the clinic",
  problem: "There is a problem",
  answer: { "": "Not answered", yes: "Yes", no: "No", "not-sure": "Not sure" } satisfies Record<Answer, string>,
  date: { label: "Date of birth", day: "Day", month: "Month", year: "Year", hint: "For example, 3 2 1949" },
  /** The parts in the order this app's readers write a date. */
  dateOrder: "dmy" as const,
  weight: { label: "Your weight", magnitude: "Weight", unit: "Weight unit" },
  height: { label: "Your height", magnitude: "Height", unit: "Height unit" },
  kilograms: "kilograms",
  pounds: "pounds",
  centimetres: "centimetres",
  inches: "inches",
  operation: "What operation are you having?",
  operationHint: "In your own words, as the hospital told you",
  couldBePregnant: "Could you be pregnant?",
  highBloodPressure: "Have you been told you have high blood pressure?",
  breathlessOnStairs: "Do you get chest pain or very short of breath climbing one flight of stairs?",
  bloodThinner: "Do you take medicine to thin your blood?",
  bloodThinnerName: "Which medicine?",
  bloodThinnerHint: "For example, warfarin or apixaban",
  anyMedicines: "Do you take any medicines?",
  anyMedicinesHint: "Include ones you buy yourself, and inhalers, creams and injections",
  medicines: "Your medicines",
  medicine: (n: number) => \`Medicine \${n}\`,
  addMedicine: "Add a medicine",
  removeMedicine: (n: number) => \`Remove medicine \${n}\`,
  medicineName: "Name",
  medicineDose: "How much, and how often",
  anyAllergies: "Are you allergic to anything?",
  anyAllergiesHint: "Medicines, foods, plasters, latex or anything else",
  allergies: "Your allergies",
  allergy: (n: number) => \`Allergy \${n}\`,
  addAllergy: "Add an allergy",
  removeAllergy: (n: number) => \`Remove allergy \${n}\`,
  substance: "What are you allergic to?",
  reaction: "What happens?",
  severe: "Has it ever made it hard to breathe, or made your face or throat swell?",
  anaesthesiaBefore: "Have you had an anaesthetic before?",
  anaesthesiaProblem: "Did you have a problem with it?",
  anaesthesiaProblemDetails: "What happened?",
  familyAnaesthesiaProblem: "Has a blood relative had a serious problem with an anaesthetic?",
  errors: {
    "birth-date": "Enter your date of birth as a real date that has passed",
    weight: "Enter your weight",
    height: "Enter your height",
    operation: "Enter the operation you are having",
    "could-be-pregnant": "Answer whether you could be pregnant",
    "high-blood-pressure": "Answer the question about blood pressure",
    "breathless-on-stairs": "Answer the question about chest pain or breathlessness",
    "blood-thinner": "Answer the question about blood-thinning medicine",
    "any-medicines": "Answer whether you take any medicines",
    "medicine-list": "Add the medicines you take, or answer no",
    "any-allergies": "Answer whether you are allergic to anything",
    "allergy-list": "Add what you are allergic to, or answer no",
    "anaesthesia-before": "Answer whether you have had an anaesthetic before",
    "anaesthesia-problem": "Answer whether you had a problem with it",
    "family-anaesthesia-problem": "Answer the question about your family",
  } as Record<string, string>,
  change: "Change",
  none: "None",
  sentTitle: "Your answers have been sent",
  sentBody: "Thank you. Bring your medicines, or a list of them, to your assessment.",
  clinicLink: "See what the clinic sees",
  clinic: {
    title: "Pre-operative answers from the patient",
    note: "Answered by the patient and not yet checked. The anaesthetist assigns the ASA grade at the assessment.",
    nothing: "No answers have been sent from this device.",
    look: "Look at first",
    nothingToLook: "Nothing stands out in these answers.",
    bmi: "Body mass index, from the patient's weight and height",
    allergies: "Allergies",
    noMedicines: "Takes no medicines",
    medicinesNotRecorded: "Medicines not recorded",
    noneKnown: "No known allergies",
    notRecorded: "Allergies not recorded",
    severe: "Severe reaction",
    medicines: "Medicines",
    answers: "All answers",
  },
  flags: {
    "severe-allergy": "A severe allergic reaction",
    "anaesthesia-problem": "A problem with a previous anaesthetic",
    "family-anaesthesia-problem": "A serious problem with an anaesthetic in the family",
    "blood-thinner": "Takes medicine to thin the blood",
    "could-be-pregnant": "Could be pregnant",
    "breathless-on-stairs": "Chest pain or breathlessness on one flight of stairs",
    "bmi-40-or-more": "Body mass index 40 or more",
    "not-sure": "Not sure of at least one answer: ask at the assessment",
  } satisfies Record<Flag, string>,
};`}</code></pre>

  <h2>Step 6: Keep a draft</h2>

  <p>The answers are saved on the device as the patient goes. When the app fills itself from a draft, it says so, as in the <a href="/recipes/">restored draft recipe</a>, rather than showing answers the patient does not remember giving.</p>

  <p><code>src/lib/draft.svelte.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/draft.svelte.ts"><code>{`import { blank, type Answers } from "./answers.js";

// The answers in progress, kept on this device only, so a closed tab loses nothing. Sending moves them to the clinic's place.

const browser = typeof localStorage !== "undefined";
const DRAFT = "pre-operative-assessment-draft";
const SENT = "pre-operative-assessment-sent";

function read<T>(key: string): T | undefined {
  if (!browser) return undefined;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

const saved = read<{ answers: Answers; step: number }>(DRAFT);

export const draft = $state({
  answers: saved?.answers ?? blank(),
  step: saved?.step ?? 0,
  restored: saved !== undefined,
  sent: false,
});

export function save(): void {
  if (browser && !draft.sent)
    localStorage.setItem(DRAFT, JSON.stringify({ answers: draft.answers, step: draft.step }));
}

export function startAgain(): void {
  draft.answers = blank();
  draft.step = 0;
  draft.restored = false;
  localStorage.removeItem(DRAFT);
}

/** In this tutorial the clinic's place is another key on the same device; in the full project it is a server. */
export function send(answers: Answers): void {
  localStorage.setItem(SENT, JSON.stringify(answers));
  localStorage.removeItem(DRAFT);
  draft.sent = true;
}

export function sentAnswers(): Answers | undefined {
  return read<Answers>(SENT);
}`}</code></pre>

  <h2>Step 7: Ask a question</h2>

  <p>One component asks every yes, no or not sure question. A follow-up, such as "Which medicine?", is asked only after "Yes" and sits straight after that answer, so it is read and tabbed to next: the <a href="/recipes/">conditional question recipe</a>. Keep a follow-up to one simple question; a list, like the allergies, comes after the question instead.</p>

  <p><code>src/lib/components/Question.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/Question.svelte"><code>{`<` + `script lang="ts">
  import type { Snippet } from "svelte";
  import { RadioGroup } from "@lilydesignsystem/svelte-headless";
  import type { Answer } from "#lib/answers.js";
  import { words } from "#lib/words.js";

  // A question answered yes, no or not sure. A follow-up, when given, is asked only after "Yes": it sits straight after that
  // answer, so it is read and tabbed to next, and the rules leave its answer out when "Yes" is taken back.
  let {
    id,
    question,
    hint = "",
    error = "",
    value = $bindable(""),
    followUp,
  }: {
    id: string;
    question: string;
    hint?: string;
    error?: string;
    value?: Answer;
    followUp?: Snippet;
  } = $props();

  const options = ["yes", "no", "not-sure"] as const;
  const describedBy = $derived(
    [hint ? \`\${id}-hint\` : "", error ? \`\${id}-error\` : ""].filter(Boolean).join(" ") || undefined,
  );
<` + `/script>

<RadioGroup label={question} {id} aria-describedby={describedBy} aria-invalid={error ? "true" : undefined}>
  <legend>{question}</legend>
  {#if hint}<p class="hint" id={\`\${id}-hint\`}>{hint}</p>{/if}
  {#if error}<p class="error-message" id={\`\${id}-error\`}>{error}</p>{/if}
  {#each options as option (option)}
    <input
      class="radio-input"
      type="radio"
      id={\`\${id}-\${option}\`}
      name={id}
      value={option}
      bind:group={value}
    />
    <label class="label" for={\`\${id}-\${option}\`}>{words.answer[option]}</label>
    {#if option === "yes" && value === "yes" && followUp}
      <div>{@render followUp()}</div>
    {/if}
  {/each}
</RadioGroup>`}</code></pre>

  <h2>Step 8: Ask the five steps</h2>

  <p>The date of birth is three typed parts, which is easier than a calendar for a date a person knows by heart. Weight and height each take a unit. Medicines and allergies are a <code>RepeatableFieldset</code>: "Add another", with each entry named "Medicine 1", "Medicine 2".</p>

  <p><code>src/lib/components/AboutYou.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/AboutYou.svelte"><code>{`<` + `script lang="ts">
  import { DateField, Field, QuantityInputDiv, TextInput } from "@lilydesignsystem/svelte-headless";
  import type { Answers } from "#lib/answers.js";
  import Question from "#lib/components/Question.svelte";
  import { words } from "#lib/words.js";

  let { answers, errors }: { answers: Answers; errors: string[] } = $props();
  const error = (id: string) => (errors.includes(id) ? words.errors[id] : "");
<` + `/script>

<DateField
  id="birth-date"
  label={words.date.label}
  dayLabel={words.date.day}
  monthLabel={words.date.month}
  yearLabel={words.date.year}
  order={words.dateOrder}
  description={words.date.hint}
  autocomplete="bday"
  error={error("birth-date")}
  bind:value={answers.birthDate}
/>
<QuantityInputDiv
  id="weight"
  label={words.weight.label}
  magnitudeLabel={words.weight.magnitude}
  unitLabel={words.weight.unit}
  units={[
    { value: "kg", label: words.kilograms, min: 1, max: 400, step: "any" },
    { value: "lb", label: words.pounds, min: 2, max: 880, step: "any" },
  ]}
  bind:magnitude={answers.weight.magnitude}
  bind:unit={answers.weight.unit}
/>
{#if error("weight")}<p class="error-message">{error("weight")}</p>{/if}
<QuantityInputDiv
  id="height"
  label={words.height.label}
  magnitudeLabel={words.height.magnitude}
  unitLabel={words.height.unit}
  units={[
    { value: "cm", label: words.centimetres, min: 50, max: 250, step: "any" },
    { value: "in", label: words.inches, min: 20, max: 100, step: "any" },
  ]}
  bind:magnitude={answers.height.magnitude}
  bind:unit={answers.height.unit}
/>
{#if error("height")}<p class="error-message">{error("height")}</p>{/if}
<Field label={words.operation} description={words.operationHint} error={error("operation")} inputId="operation">
  <TextInput
    id="operation"
    label={words.operation}
    aria-describedby={error("operation") ? "operation-desc operation-error" : "operation-desc"}
    bind:value={answers.operation}
  />
</Field>
<Question id="could-be-pregnant" question={words.couldBePregnant} error={error("could-be-pregnant")} bind:value={answers.couldBePregnant} />`}</code></pre>

  <p><code>src/lib/components/HeartAndLungs.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/HeartAndLungs.svelte"><code>{`<` + `script lang="ts">
  import { Field, TextInput } from "@lilydesignsystem/svelte-headless";
  import type { Answers } from "#lib/answers.js";
  import Question from "#lib/components/Question.svelte";
  import { words } from "#lib/words.js";

  let { answers, errors }: { answers: Answers; errors: string[] } = $props();
  const error = (id: string) => (errors.includes(id) ? words.errors[id] : "");
<` + `/script>

<Question id="high-blood-pressure" question={words.highBloodPressure} error={error("high-blood-pressure")} bind:value={answers.highBloodPressure} />
<Question id="breathless-on-stairs" question={words.breathlessOnStairs} error={error("breathless-on-stairs")} bind:value={answers.breathlessOnStairs} />
<Question id="blood-thinner" question={words.bloodThinner} error={error("blood-thinner")} bind:value={answers.bloodThinner}>
  {#snippet followUp()}
    <Field label={words.bloodThinnerName} description={words.bloodThinnerHint} inputId="blood-thinner-name">
      <TextInput
        id="blood-thinner-name"
        label={words.bloodThinnerName}
        aria-describedby="blood-thinner-name-desc"
        bind:value={answers.bloodThinnerName}
      />
    </Field>
  {/snippet}
</Question>`}</code></pre>

  <p><code>src/lib/components/Medicines.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/Medicines.svelte"><code>{`<` + `script lang="ts">
  import { Field, RepeatableFieldset, TextInput } from "@lilydesignsystem/svelte-headless";
  import type { Answers, Medicine } from "#lib/answers.js";
  import Question from "#lib/components/Question.svelte";
  import { words } from "#lib/words.js";

  let { answers, errors }: { answers: Answers; errors: string[] } = $props();
  const error = (id: string) => (errors.includes(id) ? words.errors[id] : "");
  const newMedicine = (): Medicine => ({ name: "", dose: "" });

  // As for allergies: "No" is said, never assumed from an empty list.
  $effect(() => {
    if (answers.anyMedicines === "yes" && answers.medicines.length === 0) answers.medicines = [newMedicine()];
  });
<` + `/script>

<Question id="any-medicines" question={words.anyMedicines} hint={words.anyMedicinesHint} error={error("any-medicines")} bind:value={answers.anyMedicines} />
{#if answers.anyMedicines === "yes"}
  {#if error("medicine-list")}<p class="error-message" id="medicine-list">{error("medicine-list")}</p>{/if}
  <RepeatableFieldset
    legend={words.medicines}
    bind:items={answers.medicines}
    newItem={newMedicine}
    itemLegend={words.medicine}
    addLabel={words.addMedicine}
    removeLabel={words.removeMedicine}
    min={1}
  >
    {#snippet item(medicine: Medicine, i: number)}
      <Field label={words.medicineName} inputId={\`medicine-\${i}-name\`}>
        <TextInput id={\`medicine-\${i}-name\`} label={words.medicineName} bind:value={medicine.name} />
      </Field>
      <Field label={words.medicineDose} inputId={\`medicine-\${i}-dose\`}>
        <TextInput id={\`medicine-\${i}-dose\`} label={words.medicineDose} bind:value={medicine.dose} />
      </Field>
    {/snippet}
  </RepeatableFieldset>
{/if}`}</code></pre>

  <p><code>src/lib/components/Allergies.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/Allergies.svelte"><code>{`<` + `script lang="ts">
  import { Field, RepeatableFieldset, TextInput } from "@lilydesignsystem/svelte-headless";
  import type { Allergy, Answers } from "#lib/answers.js";
  import Question from "#lib/components/Question.svelte";
  import { words } from "#lib/words.js";

  let { answers, errors }: { answers: Answers; errors: string[] } = $props();
  const error = (id: string) => (errors.includes(id) ? words.errors[id] : "");
  const newAllergy = (): Allergy => ({ substance: "", reaction: "", severe: "" });

  // "No" is said, never assumed from an empty list. A "Yes" starts the list with one allergy to fill in.
  $effect(() => {
    if (answers.anyAllergies === "yes" && answers.allergies.length === 0) answers.allergies = [newAllergy()];
  });
<` + `/script>

<Question id="any-allergies" question={words.anyAllergies} hint={words.anyAllergiesHint} error={error("any-allergies")} bind:value={answers.anyAllergies} />
{#if answers.anyAllergies === "yes"}
  {#if error("allergy-list")}<p class="error-message" id="allergy-list">{error("allergy-list")}</p>{/if}
  <RepeatableFieldset
    legend={words.allergies}
    bind:items={answers.allergies}
    newItem={newAllergy}
    itemLegend={words.allergy}
    addLabel={words.addAllergy}
    removeLabel={words.removeAllergy}
    min={1}
  >
    {#snippet item(allergy: Allergy, i: number)}
      <Field label={words.substance} inputId={\`allergy-\${i}-substance\`}>
        <TextInput id={\`allergy-\${i}-substance\`} label={words.substance} bind:value={allergy.substance} />
      </Field>
      <Field label={words.reaction} inputId={\`allergy-\${i}-reaction\`}>
        <TextInput id={\`allergy-\${i}-reaction\`} label={words.reaction} bind:value={allergy.reaction} />
      </Field>
      <Question id={\`allergy-\${i}-severe\`} question={words.severe} bind:value={allergy.severe} />
    {/snippet}
  </RepeatableFieldset>
{/if}`}</code></pre>

  <p><code>src/lib/components/Anaesthesia.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/Anaesthesia.svelte"><code>{`<` + `script lang="ts">
  import { Field, TextInput } from "@lilydesignsystem/svelte-headless";
  import type { Answers } from "#lib/answers.js";
  import Question from "#lib/components/Question.svelte";
  import { words } from "#lib/words.js";

  let { answers, errors }: { answers: Answers; errors: string[] } = $props();
  const error = (id: string) => (errors.includes(id) ? words.errors[id] : "");
<` + `/script>

<Question id="anaesthesia-before" question={words.anaesthesiaBefore} error={error("anaesthesia-before")} bind:value={answers.anaesthesiaBefore} />
{#if answers.anaesthesiaBefore === "yes"}
  <Question id="anaesthesia-problem" question={words.anaesthesiaProblem} error={error("anaesthesia-problem")} bind:value={answers.anaesthesiaProblem}>
    {#snippet followUp()}
      <Field label={words.anaesthesiaProblemDetails} inputId="anaesthesia-problem-details">
        <TextInput id="anaesthesia-problem-details" label={words.anaesthesiaProblemDetails} bind:value={answers.anaesthesiaProblemDetails} />
      </Field>
    {/snippet}
  </Question>
{/if}
<Question id="family-anaesthesia-problem" question={words.familyAnaesthesiaProblem} error={error("family-anaesthesia-problem")} bind:value={answers.familyAnaesthesiaProblem} />`}</code></pre>

  <h2>Step 9: Check the answers</h2>

  <p>The patient sees their answers as they will be sent, with a change button for each step. The clinic's page uses the same component without the buttons.</p>

  <p><code>src/lib/components/CheckAnswers.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/CheckAnswers.svelte"><code>{`<` + `script lang="ts">
  import { Button, SummaryList, SummaryListItem } from "@lilydesignsystem/svelte-headless";
  import type { Answers } from "#lib/answers.js";
  import { sent } from "#lib/rules.js";
  import { words } from "#lib/words.js";

  // The answers as they will be sent, so a hidden answer is not shown either. onChange, when given, adds a change button per
  // section; the clinic's view leaves it out.
  let { answers, onChange }: { answers: Answers; onChange?: (step: number) => void } = $props();
  const s = $derived(sent(answers));
  const said = (a: keyof typeof words.answer) => words.answer[a];
  // A date of birth is a calendar date, not a moment: formatted in UTC so no time zone moves it a day.
  const date = (iso: string) =>
    iso
      ? new Intl.DateTimeFormat(words.locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(\`\${iso}T00:00:00Z\`))
      : words.answer[""];
  const quantity = (q: { magnitude: string; unit: string }, units: Record<string, string>) =>
    q.magnitude ? \`\${q.magnitude} \${units[q.unit] ?? q.unit}\` : words.answer[""];
  const sections = $derived([
    {
      step: 0,
      name: words.stepNames.about,
      rows: [
        [words.date.label, date(s.birthDate)],
        [words.weight.label, quantity(s.weight, { kg: words.kilograms, lb: words.pounds })],
        [words.height.label, quantity(s.height, { cm: words.centimetres, in: words.inches })],
        [words.operation, s.operation || words.answer[""]],
        [words.couldBePregnant, said(s.couldBePregnant)],
      ],
    },
    {
      step: 1,
      name: words.stepNames.heart,
      rows: [
        [words.highBloodPressure, said(s.highBloodPressure)],
        [words.breathlessOnStairs, said(s.breathlessOnStairs)],
        [words.bloodThinner, s.bloodThinnerName ? \`\${said(s.bloodThinner)}: \${s.bloodThinnerName}\` : said(s.bloodThinner)],
      ],
    },
    {
      step: 2,
      name: words.stepNames.medicines,
      rows: [
        [words.anyMedicines, said(s.anyMedicines)],
        ...s.medicines.map((m, i) => [words.medicine(i + 1), [m.name, m.dose].filter(Boolean).join(", ")]),
      ],
    },
    {
      step: 3,
      name: words.stepNames.allergies,
      rows: [
        [words.anyAllergies, said(s.anyAllergies)],
        ...s.allergies.map((x, i) => [
          words.allergy(i + 1),
          [x.substance, x.reaction, x.severe === "yes" ? words.clinic.severe : ""].filter(Boolean).join(", "),
        ]),
      ],
    },
    {
      step: 4,
      name: words.stepNames.anaesthesia,
      rows: [
        [words.anaesthesiaBefore, said(s.anaesthesiaBefore)],
        ...(s.anaesthesiaBefore === "yes"
          ? [[words.anaesthesiaProblem, [said(s.anaesthesiaProblem), s.anaesthesiaProblemDetails].filter(Boolean).join(": ")]]
          : []),
        [words.familyAnaesthesiaProblem, said(s.familyAnaesthesiaProblem)],
      ],
    },
  ]);
<` + `/script>

{#each sections as section (section.step)}
  <h2>{section.name}</h2>
  {#if onChange}
    <Button onclick={() => onChange(section.step)}>{words.change}<span class="screen-reader-span"> {section.name}</span></Button>
  {/if}
  <SummaryList label={section.name}>
    {#each section.rows as [term, value], i (i)}
      <SummaryListItem {term}>{value}</SummaryListItem>
    {/each}
  </SummaryList>
{/each}`}</code></pre>

  <h2>Step 10: Put the questions together</h2>

  <p>One step at a time. Continuing with an answer missing shows an error summary that links to each question, and moves focus to it.</p>

  <p><code>src/routes/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+page.svelte"><code>{`<` + `script lang="ts">
  import { tick } from "svelte";
  import { Alert, Button, ErrorSummary, Form, StepList, StepListItem } from "@lilydesignsystem/svelte-headless";
  import AboutYou from "#lib/components/AboutYou.svelte";
  import Allergies from "#lib/components/Allergies.svelte";
  import Anaesthesia from "#lib/components/Anaesthesia.svelte";
  import CheckAnswers from "#lib/components/CheckAnswers.svelte";
  import HeartAndLungs from "#lib/components/HeartAndLungs.svelte";
  import Medicines from "#lib/components/Medicines.svelte";
  import { draft, save, send, startAgain } from "#lib/draft.svelte.js";
  import { missing, sent, today, type Section } from "#lib/rules.js";
  import { words } from "#lib/words.js";

  const steps: (Section | "check")[] = ["about", "heart", "medicines", "allergies", "anaesthesia", "check"];
  let errors: string[] = $state([]);
  const step = $derived(steps[draft.step]);

  // Saved on every change, on this device only.
  $effect(() => {
    JSON.stringify(draft.answers);
    save();
  });

  /** Where each error links to: the first control of its question. */
  function anchor(id: string): string {
    if (id === "birth-date") return "birth-date-day";
    if (id === "weight" || id === "height") return \`\${id}-magnitude\`;
    if (id === "operation") return id;
    if (id === "medicine-list") return "medicine-0-name";
    if (id === "allergy-list") return "allergy-0-substance";
    return \`\${id}-yes\`;
  }

  async function go(to: number) {
    errors = [];
    draft.step = to;
    await tick();
    document.querySelector<HTMLElement>("h2")?.focus();
  }

  async function next(event: SubmitEvent) {
    event.preventDefault();
    if (step === "check") {
      send(sent(draft.answers));
      return;
    }
    errors = missing(step, draft.answers, today(words.timeZone));
    if (errors.length > 0) {
      await tick();
      document.querySelector<HTMLElement>(".error-summary")?.focus();
      return;
    }
    await go(draft.step + 1);
  }
<` + `/script>

<svelte:head><title>{words.title}</title></svelte:head>

<main>
  <h1>{words.title}</h1>
  {#if draft.sent}
    <Alert type="success" role="status" heading={words.sentTitle}>
      <p>{words.sentBody}</p>
      <p><a href="/clinic">{words.clinicLink}</a></p>
    </Alert>
  {:else}
    <p>{words.intro} {words.saved}</p>
    {#if draft.restored}
      <Alert type="info" role="status">
        <p>{words.restored}</p>
        <Button onclick={() => (draft.restored = false)}>{words.keep}</Button>
        <Button onclick={startAgain}>{words.startAgain}</Button>
      </Alert>
    {/if}
    <StepList label={words.steps} current={draft.step}>
      {#each steps as s, i (s)}
        <StepListItem
          current={i === draft.step}
          status={i < draft.step ? "finished" : i === draft.step ? "in-progress" : "waiting"}
          aria-current={i === draft.step ? "step" : undefined}
        >
          {words.stepNames[s]}
        </StepListItem>
      {/each}
    </StepList>
    <Form label={words.stepNames[step]} onsubmit={next} novalidate>
      <h2 tabindex="-1">{words.stepNames[step]}</h2>
      {#if errors.length > 0}
        <ErrorSummary title={words.problem}>
          <ul>
            {#each errors as id (id)}
              <li><a href={\`#\${anchor(id)}\`}>{words.errors[id]}</a></li>
            {/each}
          </ul>
        </ErrorSummary>
      {/if}
      {#if step === "about"}
        <AboutYou answers={draft.answers} {errors} />
      {:else if step === "heart"}
        <HeartAndLungs answers={draft.answers} {errors} />
      {:else if step === "medicines"}
        <Medicines answers={draft.answers} {errors} />
      {:else if step === "allergies"}
        <Allergies answers={draft.answers} {errors} />
      {:else if step === "anaesthesia"}
        <Anaesthesia answers={draft.answers} {errors} />
      {:else}
        <CheckAnswers answers={draft.answers} onChange={go} />
      {/if}
      {#if draft.step > 0}
        <Button onclick={() => go(draft.step - 1)}>{words.back}</Button>
      {/if}
      <Button type="submit">{step === "check" ? words.send : words.next}</Button>
    </Form>
  {/if}
</main>`}</code></pre>

  <h2>Step 11: Show the clinic</h2>

  <p>In this tutorial the clinic's page reads the answers sent from the same device. It lists what to look at first, the allergies with their status in words, and every answer. It says the answers are the patient's own and not yet checked.</p>

  <p><code>src/routes/clinic/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/clinic/+page.svelte"><code>{`<` + `script lang="ts">
  import { AllergyRecordList, AllergyRecordListItem } from "@lilydesignsystem/svelte-headless";
  import CheckAnswers from "#lib/components/CheckAnswers.svelte";
  import { sentAnswers } from "#lib/draft.svelte.js";
  import { allergyStatus, bmi, flags } from "#lib/rules.js";
  import { words } from "#lib/words.js";

  // What the pre-operative clinic sees before the assessment. The patient never sees a grade: the anaesthetist assigns it.
  const answers = sentAnswers();
  const status = answers ? allergyStatus(answers) : "not-recorded";
  const index = answers ? bmi(answers) : undefined;
<` + `/script>

<svelte:head><title>{words.clinic.title}</title></svelte:head>

<main>
  <h1>{words.clinic.title}</h1>
  {#if !answers}
    <p>{words.clinic.nothing}</p>
  {:else}
    <p>{words.clinic.note}</p>
    <h2>{words.clinic.look}</h2>
    {#if flags(answers).length === 0}
      <p>{words.clinic.nothingToLook}</p>
    {:else}
      <ol>
        {#each flags(answers) as flag (flag)}<li>{words.flags[flag]}</li>{/each}
      </ol>
    {/if}
    {#if index !== undefined}
      <p>{words.clinic.bmi}: <data value={String(index)}>{index}</data></p>
    {/if}
    <h2>{words.clinic.allergies}</h2>
    <AllergyRecordList
      {status}
      statusLabel={status === "none-known" ? words.clinic.noneKnown : words.clinic.notRecorded}
      label={words.clinic.allergies}
    >
      {#each answers.allergies as allergy, i (i)}
        <AllergyRecordListItem
          substance={allergy.substance}
          reaction={allergy.reaction}
          severity={allergy.severe === "yes" ? "severe" : undefined}
          severityLabel={allergy.severe === "yes" ? words.clinic.severe : undefined}
        />
      {/each}
    </AllergyRecordList>
    <h2>{words.clinic.answers}</h2>
    <CheckAnswers {answers} />
  {/if}
</main>`}</code></pre>

  <div class="callout">
    <p style="margin: 0;"><strong>Check your work:</strong> run <code>pnpm dev</code>. Press Continue with nothing filled in: the error summary lists each question. Answer "Yes" to blood-thinning medicine, then "No": the follow-up goes, and it is not sent. Close the tab and open it again: the app says it filled in your saved answers. Send them, then open the clinic's page: a severe allergy comes first.</p>
  </div>

  <h2>What this does not do yet</h2>

  <ul>
    <li>It sends nothing anywhere. The "clinic" reads the same browser's storage, so it only works on the patient's own device.</li>
    <li>It asks five steps of questions, not the sixteen a pre-operative clinic asks.</li>
    <li>It knows nothing about who the patient is: no sign-in, no hospital number, no link to the operation booked.</li>
  </ul>

  <h2>From here to the full project</h2>

  <ul>
    <li><strong>The questions</strong>: the full <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-patient/doc/questionnaire-specification.md">questionnaire specification</a>, sixteen steps from demographics to pregnancy.</li>
    <li><strong>The flags</strong>: your <code>flags</code> grows into <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-patient/front-end-with-svelte/src/lib/engine/flagged-issues.ts">flagged-issues.ts</a>, with the reasons in <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-patient/doc/risk-factors-and-flagged-issues.md">risk factors and flagged issues</a>.</li>
    <li><strong>The grade</strong>: <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-patient/front-end-with-svelte/src/lib/engine/asa-rules.ts">asa-rules.ts</a> suggests a preliminary ASA grade for the anaesthetist to review, from the rules in <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-patient/doc/asa-grading-rules.md">ASA grading rules</a>.</li>
    <li><strong>The record</strong>: the <a href="https://github.com/FormExamples/form-examples/tree/main/forms/pre-operative-assessment-by-patient/sql">database migrations</a>, the <a href="https://github.com/FormExamples/form-examples/tree/main/forms/pre-operative-assessment-by-patient/fhir/r5">FHIR R5</a> resources and the <a href="https://github.com/FormExamples/form-examples/tree/main/forms/pre-operative-assessment-by-patient/back-end-with-axum">back end</a> replace your <code>send</code>.</li>
    <li><strong>The clinician's side</strong>: the <a href="https://github.com/FormExamples/form-examples/blob/main/forms/pre-operative-assessment-by-clinician/index.md">pre-operative assessment by clinician</a> records findings, vital signs and scores, and is where the grade is assigned.</li>
  </ul>

  <p>A good next step is to replace <code>send</code> with a request to a server, and keep every test as it is.</p>

  <h2>Next steps</h2>

  <ul>
    <li><a href="/tutorials/pre-operative-assessment-by-patient/swift/">Swift version</a>: the same questionnaire and rules on iPhone, with SwiftUI.</li>
    <li><a href="/tutorials/pre-operative-assessment-by-patient/kotlin/">Kotlin version</a>: the same on Android, with Jetpack Compose.</li>
    <li><a href="/tutorials/electronic-patient-record/">Electronic patient record tutorial</a>: record the allergies the patient told you about.</li>
    <li><a href="/tutorials/international-patient-summary/">International Patient Summary tutorial</a>: read the summary a patient brings from elsewhere.</li>
    <li><a href="/tutorials/patient-administration-system/">Patient administration system tutorial</a>: book the assessment.</li>
    <li><a href="/patterns/healthcare/">Healthcare patterns</a>: patient banners, record lists and the states of an entry.</li>
  </ul>
</section>
