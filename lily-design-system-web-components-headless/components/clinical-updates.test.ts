// A mounted clinical element shows the state it is in now (HC-C16, tasks.md P50-T1): the audit of 2026-11-25 found that a result
// masked after it was shown kept its value and its flag on screen, since every element was built once and never again.
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

import { AgeView } from "./age-view.js";
import { AllergyRecordList } from "./allergy-record-list.js";
import { DateTimeView } from "./date-time-view.js";
import { DecisionSupportCard } from "./decision-support-card.js";
import { DeviceRecordList } from "./device-record-list.js";
import { DurationView } from "./duration-view.js";
import { EarlyWarningScoreView } from "./early-warning-score-view.js";
import { ImmunizationRecordList } from "./immunization-record-list.js";
import { InternationalPatientSummary } from "./international-patient-summary.js";
import { InternationalPatientSummarySection } from "./international-patient-summary-section.js";
import { MedicationRecordList } from "./medication-record-list.js";
import { MedicationView } from "./medication-view.js";
import { ObservationView } from "./observation-view.js";
import { ProblemRecordList } from "./problem-record-list.js";
import { ProcedureRecordList } from "./procedure-record-list.js";
import { RecordList } from "./record-list.js";

const ELEMENTS: Record<string, CustomElementConstructor> = {
    "age-view": AgeView,
    "allergy-record-list": AllergyRecordList,
    "date-time-view": DateTimeView,
    "decision-support-card": DecisionSupportCard,
    "device-record-list": DeviceRecordList,
    "duration-view": DurationView,
    "early-warning-score-view": EarlyWarningScoreView,
    "immunization-record-list": ImmunizationRecordList,
    "international-patient-summary": InternationalPatientSummary,
    "international-patient-summary-section": InternationalPatientSummarySection,
    "medication-record-list": MedicationRecordList,
    "medication-view": MedicationView,
    "observation-view": ObservationView,
    "problem-record-list": ProblemRecordList,
    "procedure-record-list": ProcedureRecordList,
    "record-list": RecordList,
};
for (const [slug, element] of Object.entries(ELEMENTS))
    if (!customElements.get(`lily-${slug}`)) customElements.define(`lily-${slug}`, element);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function mount(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}
async function set(el: HTMLElement, attributes: Record<string, string | null>): Promise<void> {
    for (const [name, value] of Object.entries(attributes))
        if (value === null) el.removeAttribute(name);
        else el.setAttribute(name, value);
    await Promise.resolve();
}
const words = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

describe("observation-view", () => {
    const final = () =>
        mount(
            `<lily-observation-view label="Potassium" value="7.1" unit="mmol/L" interpretation="HH" flag-label="Critical" range="3.5–5.3" meter-value="7.1" meter-min="2" meter-max="8"></lily-observation-view>`,
        );
    const expectNoRecord = (el: HTMLElement) => {
        expect(el.outerHTML).not.toMatch(/7\.1|Critical|HH|3\.5|mmol/);
        expect(el.querySelector("meter, del, [data-interpretation]")).toBeNull();
    };

    test("HC-C16: a result masked after it is shown keeps no value, flag, range, meter or attribute", async () => {
        const el = final();
        await set(el, { "status-label": "Withheld", status: "masked" });
        expect(words(el)).toBe("Potassium Withheld");
        expect(el.firstElementChild?.getAttribute("data-status")).toBe("masked");
        expectNoRecord(el);
    });

    test("HC-C16: a result entered in error after it is shown shows only its words", async () => {
        const el = final();
        await set(el, { status: "entered-in-error", "status-label": "Entered in error" });
        expect(words(el)).toBe("Potassium Entered in error");
        expectNoRecord(el);
    });

    test("HC-C16: a permitted result after a masked one is only the new record, whatever order the host sets it in", async () => {
        for (const order of [
            ["value", "unit", "status", "status-label"],
            ["status", "status-label", "unit", "value"],
        ]) {
            const el = final();
            await set(el, { status: "masked", "status-label": "Withheld" });
            const next: Record<string, string | null> = {
                value: "4.8",
                unit: "mg/L",
                status: "final",
                "status-label": null,
            };
            await set(el, Object.fromEntries(order.map((name) => [name, next[name]])));
            expect(words(el)).toBe("Potassium 4.8 mg/L");
            expectNoRecord(el);
        }
    });

    test("HC-C16: preliminary to corrected shows the new value, its words and the earlier value", async () => {
        const el = mount(
            `<lily-observation-view value="5.1" status="preliminary" status-label="Preliminary"></lily-observation-view>`,
        );
        await set(el, {
            value: "4.8",
            status: "corrected",
            "status-label": "Corrected",
            "previous-value": "5.1",
            "previous-label": "was 5.1",
        });
        expect(words(el)).toBe("4.8 5.1 was 5.1 Corrected");
        expect(el.querySelectorAll("del")).toHaveLength(1);
    });

    test("HC-C16: another patient's result replaces every part", async () => {
        const el = final();
        await set(el, {
            value: "4.1",
            interpretation: null,
            "flag-label": null,
            "meter-value": null,
            range: null,
        });
        expect(words(el)).toBe("Potassium 4.1 mmol/L");
        expect(el.querySelector("meter, [data-interpretation]")).toBeNull();
        expect(el.children).toHaveLength(1);
    });
});

describe("the other views", () => {
    test("HC-C16: age, duration and date-time views show the new patient's, and keep nothing on the host", async () => {
        const age = mount(
            `<lily-age-view label="Age" value="77 years" duration="P77Y"></lily-age-view>`,
        );
        await set(age, { value: "15 weeks", duration: "P15W" });
        expect(words(age)).toBe("Age 15 weeks");
        expect(age.outerHTML).not.toMatch(/77/);
        expect(age.hasAttribute("value") || age.hasAttribute("duration")).toBe(false);
        await set(age, { label: "Age at death" });
        expect(words(age)).toBe("Age at death 15 weeks");

        const duration = mount(
            `<lily-duration-view value="3 days" duration="P3D"></lily-duration-view>`,
        );
        await set(duration, { value: "4 hours", duration: "PT4H" });
        expect(words(duration)).toBe("4 hours");
        expect(duration.firstElementChild?.getAttribute("datetime")).toBe("PT4H");
        expect(duration.hasAttribute("value")).toBe(false);

        const date = mount(
            `<lily-date-time-view value="1949-02-03" format="3 Feb 1949"></lily-date-time-view>`,
        );
        await set(date, { value: "1979-02-03", format: "3 Feb 1979" });
        expect(words(date)).toBe("3 Feb 1979");
        expect(date.firstElementChild?.getAttribute("datetime")).toBe("1979-02-03");
        expect(date.outerHTML).not.toMatch(/1949/);
    });

    test("HC-C16: a date with only a new value does not keep the old words", async () => {
        const date = mount(
            `<lily-date-time-view value="1949-02-03" format="3 Feb 1949"></lily-date-time-view>`,
        );
        await set(date, { value: "1979-02-03" });
        expect(words(date)).toBe("1979-02-03");
    });

    test("HC-C16: a medicine and a score show the new patient's", async () => {
        const medicine = mount(
            `<lily-medication-view name="amoxicillin" strength="500 mg" dosage-text="One three times a day"></lily-medication-view>`,
        );
        await set(medicine, { name: "metformin", strength: "1 g", "dosage-text": null });
        expect(words(medicine)).toBe("metformin 1 g");
        const score = mount(
            `<lily-early-warning-score-view system="NEWS2" score="7" band="high" band-label="High" escalation="Urgent response"></lily-early-warning-score-view>`,
        );
        await set(score, { score: "1", band: "low", "band-label": "Low", escalation: null });
        expect(words(score)).toBe("NEWS2 1 Low");
        expect(score.firstElementChild?.getAttribute("data-band")).toBe("low");
    });
});

describe("record lists", () => {
    const LISTS = Object.keys(ELEMENTS).filter((slug) => slug.endsWith("record-list"));
    test.each(LISTS)("HC-C16: %s follows its status and its words", async (slug) => {
        const el = mount(
            `<lily-${slug} status="none-known" status-label="None known"></lily-${slug}>`,
        );
        const list = el.querySelector("ul") as HTMLElement;
        await set(el, { status: "unavailable", "status-label": "Could not be loaded" });
        expect(words(list)).toBe("Could not be loaded");
        expect(list.getAttribute("data-status")).toBe("unavailable");
        expect(list.getAttribute("aria-label")).toBe("Could not be loaded");
        await set(el, { status: "known", "status-label": "Known" });
        expect(list.children).toHaveLength(0);
        expect(el.querySelector("ul")).toBe(list);
    });

    test.each(LISTS)("HC-C16: %s keeps the entries it holds through a change", async (slug) => {
        const el = mount(
            `<lily-${slug} status="known" status-label="Known"><li>Penicillin</li></lily-${slug}>`,
        );
        const entry = el.querySelector("li");
        await set(el, { "status-label": "Known entries" });
        expect(el.querySelector("li")).toBe(entry);
        expect(el.querySelector("ul")?.getAttribute("aria-label")).toBe("Known entries");
    });
});

describe("decision-support-card", () => {
    const card = () =>
        mount(
            `<lily-decision-support-card summary="Penicillin allergy" indicator="critical" indicator-label="Critical" source-label="Formulary" dismiss-label="Dismiss" override-reasons='[{"code":"reason-a","display":"A"}]' override-reason-label="Reason"><p>Detail</p></lily-decision-support-card>`,
        );
    const dismissals = (el: HTMLElement) => {
        const out: unknown[] = [];
        el.addEventListener("dismiss", (event) => out.push((event as CustomEvent).detail.reason));
        return out;
    };
    const dismiss = async () => {
        (document.querySelector(".decision-support-card-dismiss") as HTMLElement).focus();
        await userEvent.setup().keyboard("{Enter}");
    };

    test("HC-C16: a new card replaces every part and keeps its detail", async () => {
        const el = card();
        const detail = el.querySelector("p:not([class])");
        await set(el, {
            summary: "Reduce the dose",
            indicator: "warning",
            "indicator-label": "Warning",
            suggestions: '[{"id":"s","label":"Halve it"}]',
        });
        expect(words(el)).toContain("Warning Reduce the dose");
        expect(words(el)).not.toContain("Penicillin");
        expect(el.querySelector("[role=group]")?.getAttribute("aria-label")).toBe(
            "Reduce the dose",
        );
        expect(el.querySelector("p:not([class])")).toBe(detail);
        expect(el.querySelectorAll("[role=group]")).toHaveLength(1);
    });

    test.each([
        [
            "other reasons",
            { summary: "Renal", "override-reasons": '[{"code":"reason-b","display":"B"}]' },
        ],
        ["the same reasons", { summary: "Renal" }],
        ["a new card-id", { "card-id": "patient-2/card-9" }],
        [
            "the reason no longer offered",
            { "override-reasons": '[{"code":"reason-b","display":"B"}]' },
        ],
    ] as [string, Record<string, string>][])(
        "HC-C15: another card's reason is never submitted: %s",
        async (_name, change) => {
            const el = card();
            if ("card-id" in change) el.setAttribute("card-id", "patient-1/card-9");
            await Promise.resolve();
            const out = dismissals(el);
            await userEvent
                .setup()
                .selectOptions(el.querySelector("select") as HTMLElement, "reason-a");
            await set(el, change);
            expect((el.querySelector("select") as HTMLSelectElement).value).toBe("");
            await dismiss();
            expect(out).toEqual([]);
        },
    );

    test("HC-C15: the same card keeps its choice when its reasons are set again", async () => {
        const el = card();
        const out = dismissals(el);
        await userEvent
            .setup()
            .selectOptions(el.querySelector("select") as HTMLElement, "reason-a");
        await set(el, {
            "override-reasons":
                '[{"code":"reason-a","display":"A again"},{"code":"x","display":"X"}]',
        });
        await dismiss();
        expect(out).toEqual(["reason-a"]);
    });
});

describe("international patient summary", () => {
    test("HC-C16: a section follows its status and heading, and keeps its entries", async () => {
        const el = mount(
            `<lily-international-patient-summary-section section="allergies" heading="Allergies" status="known"><ul><li>Penicillin</li></ul></lily-international-patient-summary-section>`,
        );
        const entry = el.querySelector("li");
        await set(el, {
            status: "unavailable",
            "status-label": "Could not be loaded",
            heading: "Allergies and intolerances",
        });
        const section = el.querySelector("section") as HTMLElement;
        expect(section.getAttribute("data-status")).toBe("unavailable");
        expect(section.querySelector("h2")?.textContent).toBe("Allergies and intolerances");
        expect(
            section.querySelector(".international-patient-summary-section-status")?.textContent,
        ).toBe("Could not be loaded");
        expect(el.querySelector("li")).toBe(entry);
        await set(el, { status: "known" });
        expect(section.querySelector(".international-patient-summary-section-status")).toBeNull();
    });

    test("HC-C16: the summary follows its label and its list of sections", async () => {
        const headings =
            '{"medications":"Medicines","allergies":"Allergies","problems":"Problems"}';
        const el = mount(
            `<lily-international-patient-summary label="Summary for A" contents-label="Contents" omitted-label="Section missing" required-headings='${headings}' sections='[{"key":"problems","heading":"Problems"}]'><section id="kept">P</section></lily-international-patient-summary>`,
        );
        const kept = el.querySelector("#kept");
        expect(el.querySelectorAll("[data-status=omitted] h2")).toHaveLength(2);
        await set(el, {
            label: "Summary for B",
            sections:
                '[{"key":"problems","heading":"Problems"},{"key":"allergies","heading":"Allergies"}]',
        });
        expect(el.querySelector("article")?.getAttribute("aria-label")).toBe("Summary for B");
        expect([...el.querySelectorAll("nav li")].map((li) => li.textContent)).toEqual([
            "Problems",
            "Allergies",
            "Medicines",
        ]);
        expect(
            [...el.querySelectorAll("section[data-status=omitted] h2")].map((h) => h.textContent),
        ).toEqual(["Medicines"]);
        expect(el.querySelector("#kept")).toBe(kept);
    });
});

test("HC-C16: every element survives a move and an unchanged attribute without rebuilding", async () => {
    const el = mount(`<lily-observation-view value="5.9"></lily-observation-view>`);
    const span = el.firstElementChild;
    const other = document.createElement("div");
    document.body.append(other);
    other.append(el);
    await set(el, { value: "5.9" });
    expect(el.firstElementChild).toBe(span);
    expect(el.children).toHaveLength(1);
});
