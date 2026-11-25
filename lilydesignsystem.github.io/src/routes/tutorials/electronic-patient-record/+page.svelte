<svelte:head>
  <title>Electronic patient record tutorial — Lily Design System</title>
  <meta name="description" content="Build a small electronic patient record, step by step, with SvelteKit and Lily: append-only history, identity first, allergies, and an audit of every read." />
</svelte:head>

<section class="page-intro">
  <h1>Electronic patient record tutorial</h1>
  <p class="page-intro-tagline">Build a record that never forgets, never overwrites and always says who looked. You finish with a small working app, and the way to the full project.</p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>

  <p>A small electronic patient record: find a patient, register one without making a duplicate, record allergies, correct a mistake without erasing it, and see who has looked. About 90 minutes.</p>

  <p>It leads to the open-source <a href="https://github.com/electronic-patient-record/electronic-patient-record">Electronic Patient Record</a>, whose site is <a href="https://electronic-patient-record.github.io/">electronic-patient-record.github.io</a>. That project is a pre-release scaffold, and it says so: read <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/spec/14-implementation-status.md">what is built</a> before you rely on any of it.</p>

  <div class="callout">
    <p style="margin: 0;"><strong>For learning only.</strong> Not for clinical use. Use invented patients, never a real person's details.</p>
  </div>

  <h2>Before you start</h2>

  <p>You need Node 26, pnpm, and a little Svelte: the <a href="/tutorials/svelte/">Svelte tutorial</a> is enough. Make the app, then add Lily:</p>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npx sv create epr --template minimal --types ts --no-add-ons --install pnpm
cd epr
pnpm add @lilydesignsystem/svelte-headless @lilydesignsystem/themes
pnpm add -D vitest`}</code></pre>

  <p>Each code block below is one whole file, under the path shown above it. Copy it as it is, replacing the file if the new app already has one.</p>

  <h2>Step 1: Choose a theme</h2>

  <p><code>src/routes/+layout.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+layout.svelte"><code>{`<` + `script lang="ts">
  import "@lilydesignsystem/themes/light.css";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
<` + `/script>

{@render children()}`}</code></pre>

  <h2>Step 2: Describe the record</h2>

  <p><code>src/lib/record.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/record.ts"><code>{`// The shapes of the record. Shared by the server and the pages, so it holds no data and no secrets.

export interface Patient {
  family: string;
  given: string;
  /** ISO 8601, and it may be partial: "1949" or "1949-02". Empty when not known. */
  birthDate: string;
  /** The hospital number. Empty when not known. */
  number: string;
}

export interface Allergy {
  substance: string;
  reaction: string;
  status: "active" | "inactive" | "entered-in-error";
}

/** One version of one thing. Versions are added, never changed and never removed. */
export interface Version<T> {
  id: string;
  version: number;
  at: string;
  author: string;
  reason: string;
  value: T;
}

export interface AuditEvent {
  at: string;
  who: string;
  purpose: string;
  action: "search" | "read" | "create" | "change" | "refused";
  patientId: string;
}

export type AllergyStatus = "known" | "none-known" | "not-recorded";`}</code></pre>

  <p>There is no "delete" here, and no "update". A record is a list of versions.</p>

  <h2>Step 3: Make history append-only</h2>

  <p><code>src/lib/server/history.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/server/history.ts"><code>{`import type { Version } from "../record.js";

/** The record moved on while someone was editing an older version of it. */
export class StaleVersion extends Error {}
export class NotFound extends Error {}
/** The change is not allowed; \`message\` says why, for the person who asked. */
export class Refused extends Error {}

/** Append-only history: there is no update and no delete, only another version. */
export class History<T> {
  #things = new Map<string, Version<T>[]>();

  create(value: T, author: string, reason = ""): Version<T> {
    return this.#add(crypto.randomUUID(), [], value, author, reason);
  }

  append(id: string, expected: number, value: T, author: string, reason: string): Version<T> {
    const versions = this.versions(id);
    if (versions[versions.length - 1].version !== expected) throw new StaleVersion();
    if (!reason.trim()) throw new Refused("Say why you are changing the record.");
    return this.#add(id, versions, value, author, reason);
  }

  latest(id: string): Version<T> {
    return this.versions(id).at(-1)!;
  }

  versions(id: string): readonly Version<T>[] {
    const versions = this.#things.get(id);
    if (!versions) throw new NotFound();
    return versions;
  }

  all(): Version<T>[] {
    return [...this.#things.keys()].map((id) => this.latest(id));
  }

  #add(id: string, before: readonly Version<T>[], value: T, author: string, reason: string) {
    const version: Version<T> = {
      id,
      version: before.length + 1,
      at: new Date().toISOString(),
      author,
      reason,
      value: structuredClone(value),
    };
    this.#things.set(id, [...before, version]);
    return version;
  }
}`}</code></pre>

  <p>Each change names the version it was made from. If someone else saved first, the change is refused, not merged and not lost without a word. Each change also needs a reason, so a person reading it next year knows why.</p>

  <h2>Step 4: Compare two people</h2>

  <p>Two records for one person split their history in two, and the half that a doctor opens may not be the half with the allergy. Joining two people is worse. So compare, explain, and let a person decide.</p>

  <p><code>src/lib/server/match.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/server/match.ts"><code>{`import type { Patient } from "../record.js";

export interface Match {
  /** One line per field, so a person can see why two records look alike. */
  fields: { field: keyof Patient; agrees: boolean | null }[];
  possible: boolean;
}

const FIELDS: (keyof Patient)[] = ["number", "family", "given", "birthDate"];
const fold = (text: string) =>
  text.normalize("NFKD").replace(/\\p{M}/gu, "").trim().toLocaleLowerCase("und");

/** Might these be the same person? This never links two records: a person decides. */
export function compare(a: Patient, b: Patient): Match {
  const fields = FIELDS.map((field) => {
    const [x, y] = [fold(a[field]), fold(b[field])];
    // A missing value is no evidence. It is not agreement, and it is not disagreement.
    return { field, agrees: x === "" || y === "" ? null : x === y };
  });
  const agrees = (field: keyof Patient) => fields.find((f) => f.field === field)!.agrees === true;
  return {
    fields,
    possible: agrees("number") || (agrees("family") && agrees("birthDate")),
  };
}`}</code></pre>

  <p>A missing value is <code>null</code>: no evidence. It must never count as agreement, or two unknown people would match perfectly.</p>

  <h2>Step 5: Store the record</h2>

  <p><code>src/lib/server/store.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/server/store.ts"><code>{`import type { Allergy, AllergyStatus, AuditEvent, Patient, Version } from "../record.js";
import { History, Refused } from "./history.js";
import { compare, type Match } from "./match.js";

export interface User {
  name: string;
  purpose: string;
}

interface OwnedAllergy extends Allergy {
  patientId: string;
}

/** In memory, for learning: everything is lost when the server stops. Use PostgreSQL for real. */
export class Store {
  #patients = new History<Patient>();
  #allergies = new History<OwnedAllergy>();
  #noneKnown = new Map<string, { said: boolean; author: string; at: string }[]>();
  #audit: AuditEvent[] = [];

  #log(user: User, action: AuditEvent["action"], patientId = "") {
    this.#audit.push({
      at: new Date().toISOString(),
      who: user.name,
      purpose: user.purpose,
      action,
      patientId,
    });
  }

  search(user: User, family: string): Version<Patient>[] {
    this.#log(user, "search");
    const wanted = family.trim().toLowerCase();
    if (!wanted) return [];
    return this.#patients.all().filter((p) => p.value.family.toLowerCase().startsWith(wanted));
  }

  duplicates(user: User, patient: Patient): { patient: Version<Patient>; match: Match }[] {
    this.#log(user, "search");
    return this.#patients
      .all()
      .map((existing) => ({ patient: existing, match: compare(patient, existing.value) }))
      .filter(({ match }) => match.possible);
  }

  create(user: User, patient: Patient): Version<Patient> {
    const created = this.#patients.create(patient, user.name);
    this.#log(user, "create", created.id);
    return created;
  }

  read(user: User, id: string) {
    const patient = this.#patients.latest(id);
    this.#log(user, "read", id);
    const allergies = this.#allergies.all().filter((a) => a.value.patientId === id);
    return { patient, allergies, allergyStatus: this.#allergyStatus(id) };
  }

  addAllergy(user: User, patientId: string, allergy: Omit<Allergy, "status">) {
    this.#patients.latest(patientId);
    if (!allergy.substance.trim()) throw new Refused("Name the substance.");
    this.#allergies.create({ ...allergy, status: "active", patientId }, user.name);
    // An allergy ends any earlier "no known allergies". The two are never both current.
    this.#say(user, patientId, false);
    this.#log(user, "change", patientId);
  }

  changeAllergy(
    user: User,
    patientId: string,
    id: string,
    expected: number,
    status: Allergy["status"],
    reason: string,
  ) {
    const allergy = this.#allergies.latest(id).value;
    // The allergy must be this patient's, whatever id the form sent.
    if (allergy.patientId !== patientId) {
      this.#log(user, "refused", patientId);
      throw new Refused("That allergy is not this patient's.");
    }
    if (allergy.status === "entered-in-error") throw new Refused("Entered in error is final.");
    this.#allergies.append(id, expected, { ...allergy, status }, user.name, reason);
    this.#log(user, "change", patientId);
  }

  sayNoneKnown(user: User, patientId: string) {
    this.#patients.latest(patientId);
    if (this.#active(patientId).length > 0)
      throw new Refused("This patient has an active allergy. End it first, with a reason.");
    this.#say(user, patientId, true);
    this.#log(user, "change", patientId);
  }

  access(user: User, patientId: string): AuditEvent[] {
    this.#patients.latest(patientId);
    this.#log(user, "read", patientId);
    return this.#audit.filter((event) => event.patientId === patientId);
  }

  #active(patientId: string) {
    return this.#allergies
      .all()
      .filter((a) => a.value.patientId === patientId && a.value.status === "active");
  }

  #say(user: User, patientId: string, said: boolean) {
    const before = this.#noneKnown.get(patientId) ?? [];
    this.#noneKnown.set(patientId, [
      ...before,
      { said, author: user.name, at: new Date().toISOString() },
    ]);
  }

  #allergyStatus(patientId: string): AllergyStatus {
    if (this.#active(patientId).length > 0) return "known";
    return this.#noneKnown.get(patientId)?.at(-1)?.said ? "none-known" : "not-recorded";
  }
}

export const store = new Store();`}</code></pre>

  <ul>
    <li><strong>Reads are audited</strong>, and not only writes. Looking at a record is an event.</li>
    <li><strong>"No known allergies" and an allergy are never both current.</strong> Adding one ends the other, and the store refuses the reverse.</li>
    <li><strong>The allergy must belong to the patient on the page</strong>, whatever id the form sent.</li>
  </ul>

  <h2>Step 6: Test the rules</h2>

  <p><code>src/lib/server/store.test.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/server/store.test.ts"><code>{`import { beforeEach, describe, expect, it } from "vitest";
import type { Patient } from "../record.js";
import { NotFound, Refused, StaleVersion } from "./history.js";
import { compare } from "./match.js";
import { Store } from "./store.js";

const user = { name: "Dr Example", purpose: "direct care" };
const alexandra: Patient = {
  family: "Example",
  given: "Alexandra",
  birthDate: "1949-02-03",
  number: "EX-000123",
};

let store: Store;
let id: string;
beforeEach(() => {
  store = new Store();
  id = store.create(user, alexandra).id;
});

const add = () => store.addAllergy(user, id, { substance: "Penicillin", reaction: "Anaphylaxis" });
const allergy = () => store.read(user, id).allergies[0];

describe("allergies", () => {
  it("starts as not recorded, which is not the same as none known", () => {
    expect(store.read(user, id).allergyStatus).toBe("not-recorded");
    store.sayNoneKnown(user, id);
    expect(store.read(user, id).allergyStatus).toBe("none-known");
  });

  it("never holds none known and an active allergy at once", () => {
    store.sayNoneKnown(user, id);
    add();
    expect(store.read(user, id).allergyStatus).toBe("known");
    expect(() => store.sayNoneKnown(user, id)).toThrow(Refused);

    // Ending the allergy does not bring the old statement back.
    store.changeAllergy(user, id, allergy().id, 1, "inactive", "Tolerated since");
    expect(store.read(user, id).allergyStatus).toBe("not-recorded");
  });

  it("refuses a change made from an older version", () => {
    add();
    const { id: allergyId } = allergy();
    store.changeAllergy(user, id, allergyId, 1, "inactive", "Tolerated since");
    expect(() => store.changeAllergy(user, id, allergyId, 1, "active", "Reaction")).toThrow(
      StaleVersion,
    );
    expect(allergy().value.status).toBe("inactive");
  });

  it("keeps a mistake on the record, for good", () => {
    add();
    store.changeAllergy(user, id, allergy().id, 1, "entered-in-error", "Wrong patient");
    expect(allergy()).toMatchObject({ version: 2, value: { status: "entered-in-error" } });
    expect(() => store.changeAllergy(user, id, allergy().id, 2, "active", "Undo")).toThrow(Refused);
  });

  it("refuses a change with no reason, or to another patient's allergy", () => {
    add();
    const other = store.create(user, { ...alexandra, given: "Alexander" }).id;
    expect(() => store.changeAllergy(user, id, allergy().id, 1, "inactive", " ")).toThrow(Refused);
    expect(() =>
      store.changeAllergy(user, other, allergy().id, 1, "inactive", "Mix-up"),
    ).toThrow(Refused);
  });
});

describe("audit", () => {
  it("records reads as well as writes", () => {
    store.read(user, id);
    add();
    expect(store.access(user, id).map((e) => e.action)).toEqual([
      "create",
      "read",
      "change",
      "read",
    ]);
  });

  it("finds nobody it does not know", () => {
    expect(() => store.read(user, "nobody")).toThrow(NotFound);
  });
});

describe("compare", () => {
  it("asks a person when the family name and birth date agree", () => {
    expect(compare(alexandra, { ...alexandra, number: "", given: "Alexander" }).possible).toBe(true);
  });

  it("does not count a missing value as agreement", () => {
    const blank = { family: "", given: "", birthDate: "", number: "" };
    expect(compare(blank, blank)).toMatchObject({
      possible: false,
      fields: [{ agrees: null }, { agrees: null }, { agrees: null }, { agrees: null }],
    });
  });
});`}</code></pre>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npx vitest run`}</code></pre>

  <div class="callout">
    <p style="margin: 0;"><strong>Check your work:</strong> nine tests pass. Change <code>compare</code> so that two empty values agree, and run them again: one fails.</p>
  </div>

  <h2>Step 7: Say who is asking</h2>

  <p><code>src/app.d.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/app.d.ts"><code>{`import type { User } from "#lib/server/store.js";

declare global {
  namespace App {
    interface Locals {
      user: User;
    }
  }
}

export {};`}</code></pre>

  <p><code>src/hooks.server.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/hooks.server.ts"><code>{`import type { Handle } from "@sveltejs/kit/hooks";

// A stand-in. A real record signs people in with OpenID Connect, checks that they may see this
// patient, and asks why they are looking.
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = { name: "Dr Example", purpose: "direct care" };
  const response = await resolve(event);
  // A patient's page is never kept by a cache, so Back cannot show it after sign-out.
  response.headers.set("cache-control", "no-store");
  return response;
};`}</code></pre>

  <h2>Step 8: Write the words</h2>

  <p><code>src/lib/words.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/words.ts"><code>{`import type { Allergy, AllergyStatus, AuditEvent, Patient } from "./record.js";

export const locale = "en-GB";

export const allergyStatuses: Record<AllergyStatus, string> = {
  known: "Known allergies",
  "none-known": "No known allergies",
  "not-recorded": "Allergies not recorded. This does not mean there are none.",
};

export const states: Record<Allergy["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  "entered-in-error": "Entered in error",
};

export const actions: Record<AuditEvent["action"], string> = {
  search: "Searched",
  read: "Read",
  create: "Created",
  change: "Changed",
  refused: "Refused",
};

export const stale =
  "Someone changed this record while you were working. Nothing was saved. Check the record below and try again.";

export const fullName = (p: Patient) =>
  [p.family.toUpperCase(), p.given].filter(Boolean).join(", ") || "Name not recorded";`}</code></pre>

  <h2>Step 9: Build the patient banner</h2>

  <p>It shows what is on record, never what is being typed into a form.</p>

  <p><code>src/lib/components/PatientBanner.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/lib/components/PatientBanner.svelte"><code>{`<` + `script lang="ts">
  import {
    AllergyRecordList,
    AllergyRecordListItem,
    formatPartialDate,
  } from "@lilydesignsystem/svelte-headless";
  import type { Allergy, AllergyStatus, Patient, Version } from "#lib/record.js";
  import { allergyStatuses, fullName, locale } from "#lib/words.js";

  let {
    patient,
    allergies,
    allergyStatus,
  }: { patient: Patient; allergies: Version<Allergy>[]; allergyStatus: AllergyStatus } = $props();

  const active = $derived(allergies.filter((a) => a.value.status === "active"));
<` + `/script>

<section class="patient-banner" aria-label={\`Patient details: \${fullName(patient)}\`}>
  <dl>
    <dt>Name</dt>
    <dd>{fullName(patient)}</dd>
    <dt>Born</dt>
    <dd>
      {#if patient.birthDate}
        <time datetime={patient.birthDate}>{formatPartialDate(patient.birthDate, locale)}</time>
      {:else}
        Not known
      {/if}
    </dd>
    <dt>Hospital number</dt>
    <dd>{patient.number || "Not known"}</dd>
    <dt>Allergies</dt>
    <dd>
      <AllergyRecordList status={allergyStatus} statusLabel={allergyStatuses[allergyStatus]}>
        {#each active as allergy (allergy.id)}
          <AllergyRecordListItem
            substance={allergy.value.substance}
            reaction={allergy.value.reaction}
          />
        {/each}
      </AllergyRecordList>
    </dd>
  </dl>
</section>`}</code></pre>

  <h2>Step 10: Find a patient</h2>

  <p><code>src/routes/+page.server.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+page.server.ts"><code>{`import { store } from "#lib/server/store.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url, locals }) => {
  const family = url.searchParams.get("family")?.trim() ?? "";
  return { family, found: family ? store.search(locals.user, family) : [] };
};`}</code></pre>

  <p><code>src/routes/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/+page.svelte"><code>{`<` + `script lang="ts">
  import { fullName } from "#lib/words.js";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
<` + `/script>

<svelte:head><title>Find a patient</title></svelte:head>

<main>
  <h1>Find a patient</h1>
  <p>For learning. Not for clinical use: never enter a real person's details.</p>
  <form role="search">
    <label for="family">Family name</label>
    <input class="text-input" id="family" name="family" value={data.family} autocomplete="off" />
    <button class="button" type="submit">Search</button>
  </form>
  {#if data.family}
    <h2>Results</h2>
    <ul>
      {#each data.found as { id, value } (id)}
        <li>
          <a href={\`/patients/\${id}\`}>{fullName(value)}</a>, born {value.birthDate || "not known"},
          number {value.number || "not known"}
        </li>
      {:else}
        <li>Nobody found with a family name that starts “{data.family}”.</li>
      {/each}
    </ul>
  {/if}
  <p><a href="/patients/new">Register a new patient</a></p>
</main>`}</code></pre>

  <h2>Step 11: Register a patient</h2>

  <p><code>src/routes/patients/new/+page.server.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/patients/new/+page.server.ts"><code>{`import { fail, redirect } from "@sveltejs/kit";
import type { Patient } from "#lib/record.js";
import { store } from "#lib/server/store.js";
import type { Actions } from "./$types";

const DATE = /^\\d{4}(-\\d{2}(-\\d{2})?)?$/;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const patient: Patient = {
      family: text("family"),
      given: text("given"),
      birthDate: text("birthDate"),
      number: text("number"),
    };
    if (!patient.family) return fail(400, { patient, error: "Enter a family name." });
    if (patient.birthDate && !DATE.test(patient.birthDate))
      return fail(400, { patient, error: "Enter a birth date like 1949-02-03, 1949-02 or 1949." });

    // Look before creating: a second record for one person splits their history in two.
    const duplicates = store.duplicates(locals.user, patient);
    if (duplicates.length > 0 && form.get("different") !== "yes")
      return fail(409, { patient, duplicates });

    redirect(303, \`/patients/\${store.create(locals.user, patient).id}\`);
  },
};`}</code></pre>

  <p><code>src/routes/patients/new/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/patients/new/+page.svelte"><code>{`<` + `script lang="ts">
  import { fullName } from "#lib/words.js";
  import type { PageProps } from "./$types";

  let { form }: PageProps = $props();
  const FIELDS = {
    family: "Family name",
    given: "Given name",
    birthDate: "Birth date (year-month-day, as much as is known)",
    number: "Hospital number",
  } as const;
  const names = Object.keys(FIELDS) as (keyof typeof FIELDS)[];
<` + `/script>

<svelte:head><title>Register a new patient</title></svelte:head>

<main>
  <h1>Register a new patient</h1>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <form method="POST">
    {#each names as name (name)}
      <p>
        <label for={name}>{FIELDS[name]}</label>
        <input class="text-input" id={name} {name} value={form?.patient[name] ?? ""} autocomplete="off" />
      </p>
    {/each}
    {#if form?.duplicates}
      <div role="alert">
        <h2>Is this the same person?</h2>
        <ul>
          {#each form.duplicates as { patient, match } (patient.id)}
            <li>
              <a href={\`/patients/\${patient.id}\`}>{fullName(patient.value)}</a>
              <ul>
                {#each match.fields as { field, agrees } (field)}
                  <li>
                    {FIELDS[field]}: {agrees === null ? "not enough to compare" : agrees ? "the same" : "different"}
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
        <label>
          <input type="checkbox" name="different" value="yes" /> I have checked: this is a different person
        </label>
      </div>
    {/if}
    <button class="button" type="submit">Register</button>
  </form>
</main>`}</code></pre>

  <p>A birth date may be only a year. Asking for more than is known invites an invention, and the invention is then a fact.</p>

  <h2>Step 12: Open the record</h2>

  <p><code>src/routes/patients/[id]/+page.server.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/patients/[id]/+page.server.ts"><code>{`import { error, fail } from "@sveltejs/kit";
import { NotFound, Refused, StaleVersion } from "#lib/server/history.js";
import { store } from "#lib/server/store.js";
import { stale } from "#lib/words.js";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params, locals }) => {
  try {
    return store.read(locals.user, params.id);
  } catch (e) {
    if (e instanceof NotFound) error(404, "No such patient");
    throw e;
  }
};

/** Say what happened in words; anything unexpected stays an error. */
async function attempt(change: () => void) {
  try {
    change();
    return { message: "Saved." };
  } catch (e) {
    if (e instanceof StaleVersion) return fail(409, { message: stale });
    if (e instanceof Refused) return fail(422, { message: e.message });
    if (e instanceof NotFound) error(404, "No such patient");
    throw e;
  }
}

export const actions: Actions = {
  add: async ({ request, params, locals }) => {
    const form = await request.formData();
    return attempt(() =>
      store.addAllergy(locals.user, params.id, {
        substance: String(form.get("substance") ?? "").trim(),
        reaction: String(form.get("reaction") ?? "").trim(),
      }),
    );
  },
  change: async ({ request, params, locals }) => {
    const form = await request.formData();
    const status = form.get("status");
    if (status !== "inactive" && status !== "entered-in-error") error(400, "Unknown status");
    return attempt(() =>
      store.changeAllergy(
        locals.user,
        params.id,
        String(form.get("allergy")),
        Number(form.get("version")),
        status,
        String(form.get("reason") ?? ""),
      ),
    );
  },
  none: async ({ params, locals }) => attempt(() => store.sayNoneKnown(locals.user, params.id)),
};`}</code></pre>

  <p><code>src/routes/patients/[id]/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/patients/[id]/+page.svelte"><code>{`<` + `script lang="ts">
  import PatientBanner from "#lib/components/PatientBanner.svelte";
  import { fullName, states } from "#lib/words.js";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
<` + `/script>

<svelte:head><title>{fullName(data.patient.value)}</title></svelte:head>

<!-- A new patient is a new page: nothing typed for one is ever left showing under another. -->
{#key data.patient.id}
  <main>
    <h1>Patient record</h1>
    <PatientBanner
      patient={data.patient.value}
      allergies={data.allergies}
      allergyStatus={data.allergyStatus}
    />
    <p role="status">{form?.message ?? ""}</p>

    <h2>Allergy history</h2>
    <ul>
      {#each data.allergies as allergy (allergy.id)}
        <li>
          {allergy.value.substance}
          {#if allergy.value.reaction}({allergy.value.reaction}){/if}: {states[allergy.value.status]},
          recorded by {allergy.author}
          {#if allergy.reason}, because: {allergy.reason}{/if}
          {#if allergy.value.status !== "entered-in-error"}
            <form method="POST" action="?/change">
              <input type="hidden" name="allergy" value={allergy.id} />
              <input type="hidden" name="version" value={allergy.version} />
              <label>
                Why change {allergy.value.substance}?
                <input class="text-input" name="reason" autocomplete="off" required />
              </label>
              <button class="button" name="status" value="inactive">
                End {allergy.value.substance}
              </button>
              <button class="button" name="status" value="entered-in-error">
                Mark {allergy.value.substance} as entered in error
              </button>
            </form>
          {/if}
        </li>
      {:else}
        <li>Nothing has been recorded.</li>
      {/each}
    </ul>

    <h2>Add an allergy</h2>
    <form method="POST" action="?/add">
      <label for="substance">Substance</label>
      <input class="text-input" id="substance" name="substance" autocomplete="off" required />
      <label for="reaction">Reaction</label>
      <input class="text-input" id="reaction" name="reaction" autocomplete="off" />
      <button class="button">Add allergy</button>
    </form>

    <form method="POST" action="?/none">
      <button class="button">Record no known allergies</button>
    </form>

    <p><a href={\`/patients/\${data.patient.id}/access\`}>Who has looked at this record</a></p>
  </main>
{/key}`}</code></pre>

  <p>The forms work without JavaScript. Every button says what it acts on ("End Penicillin"), so someone who hears the buttons alone knows which is which.</p>

  <h2>Step 13: Show who has looked</h2>

  <p><code>src/routes/patients/[id]/access/+page.server.ts</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/patients/[id]/access/+page.server.ts"><code>{`import { error } from "@sveltejs/kit";
import { NotFound } from "#lib/server/history.js";
import { store } from "#lib/server/store.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params, locals }) => {
  try {
    return { id: params.id, events: store.access(locals.user, params.id) };
  } catch (e) {
    if (e instanceof NotFound) error(404, "No such patient");
    throw e;
  }
};`}</code></pre>

  <p><code>src/routes/patients/[id]/access/+page.svelte</code></p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" data-file="src/routes/patients/[id]/access/+page.svelte"><code>{`<` + `script lang="ts">
  import { actions } from "#lib/words.js";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
<` + `/script>

<svelte:head><title>Who has looked at this record</title></svelte:head>

<main>
  <h1>Who has looked at this record</h1>
  <ol>
    {#each data.events as event, i (i)}
      <li>
        <time datetime={event.at}>{event.at}</time>: {event.who}, {actions[event.action]}, for {event.purpose}
      </li>
    {/each}
  </ol>
  <p><a href={\`/patients/\${data.id}\`}>Back to the record</a></p>
</main>`}</code></pre>

  <div class="callout">
    <p style="margin: 0;"><strong>Check your work:</strong> run <code>pnpm dev</code>. Register Alexandra Example, born 1949-02-03. Record no known allergies, then add penicillin: the statement ends. Open the record in a second tab, end penicillin in the first, then mark it as entered in error in the second: it is refused, and nothing is saved. Register Alexander Example with the same birth date: you are asked whether it is the same person.</p>
  </div>

  <h2>What this does not do yet</h2>

  <ul>
    <li>It keeps everything in memory. Stop the server and the record is gone.</li>
    <li>It has one made-up user. Anyone who can open the page is that user.</li>
    <li>It checks no permission: no role, no consent, no relationship with the patient.</li>
  </ul>

  <h2>From here to the full project</h2>

  <ul>
    <li><strong>The record</strong>: the <a href="https://github.com/electronic-patient-record/electronic-patient-record/tree/main/electronic-patient-record-service-with-rust">service</a> keeps versions in PostgreSQL, and the database itself refuses to change an audit event.</li>
    <li><strong>Identity</strong>: the <a href="https://github.com/electronic-patient-record/electronic-patient-record/tree/main/electronic-patient-record-matcher-with-rust">matcher</a> is your <code>compare</code> with real evidence: names, partial dates, identifiers, and a reason for each decision.</li>
    <li><strong>The banner</strong>: <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/electronic-patient-record-ui-with-svelte/src/lib/PatientBanner.svelte">PatientBanner.svelte</a> adds a photo, a death, a merged record and a drill patient.</li>
    <li><strong>Allergies</strong>: <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/electronic-patient-record-ui-with-svelte/src/lib/AllergySection.svelte">AllergySection.svelte</a>.</li>
    <li><strong>Signing in</strong>: <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/electronic-patient-record-ui-with-svelte/src/lib/proxy-handler.ts">proxy-handler.ts</a> keeps the token on the server, so the browser never holds it.</li>
    <li><strong>Why you are looking</strong>: <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/electronic-patient-record-ui-with-svelte/src/lib/purpose.ts">purpose.ts</a>, and <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/electronic-patient-record-ui-with-svelte/src/lib/BreakGlassSection.svelte">BreakGlassSection.svelte</a> for an emergency.</li>
    <li><strong>What production means</strong>: <a href="https://github.com/electronic-patient-record/electronic-patient-record/blob/main/governance/production-readiness.md">the path to production</a>. Much of it is people, not code: a clinical safety officer, for one.</li>
  </ul>

  <p>A good next step is to replace <code>Store</code> with a database, and keep every test as it is.</p>

  <h2>Next steps</h2>

  <ul>
    <li><a href="/tutorials/international-patient-summary/">International Patient Summary tutorial</a>: share what you have recorded.</li>
    <li><a href="/tutorials/patient-administration-system/">Patient administration system tutorial</a>: bring the patient to the clinic.</li>
    <li><a href="/patterns/healthcare/">Healthcare patterns</a>: patient banners, record lists and the states of an entry.</li>
  </ul>
</section>
