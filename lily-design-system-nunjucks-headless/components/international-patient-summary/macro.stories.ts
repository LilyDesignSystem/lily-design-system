import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<article class="international-patient-summary" aria-label="Patient summary" ><div class="international-patient-summary-banner"><!-- the patient banner pattern --></div><nav class="international-patient-summary-contents" aria-label="Contents" ><ol><li data-section="allergies" data-status="known" ><a href="#international-patient-summary-allergies">Allergies and intolerances</a></li><li data-section="problems" data-status="none-known" ><a href="#international-patient-summary-problems">Problem list</a></li><li data-section="medications" data-status="omitted" ><a href="#international-patient-summary-medications">Medication summary</a></li></ol></nav><div class="international-patient-summary-sections"><section class="international-patient-summary-section" id="international-patient-summary-allergies" aria-labelledby="international-patient-summary-allergies-heading" data-section="allergies" data-code="48765-2" data-status="known" data-required="true" ><h2 id="international-patient-summary-allergies-heading" class="international-patient-summary-section-heading" > Allergies and intolerances </h2><!-- the section\'s entries: allergy-record-list --></section><section class="international-patient-summary-section" id="international-patient-summary-problems" aria-labelledby="international-patient-summary-problems-heading" data-section="problems" data-code="11450-4" data-status="none-known" data-required="true" ><h2 id="international-patient-summary-problems-heading" class="international-patient-summary-section-heading" > Problem list </h2><p class="international-patient-summary-section-status">No known problems</p></section><section class="international-patient-summary-section" id="international-patient-summary-medications" aria-labelledby="international-patient-summary-medications-heading" data-section="medications" data-code="10160-0" data-status="omitted" data-required="true" ><h2 id="international-patient-summary-medications-heading" class="international-patient-summary-section-heading" > Medication summary </h2><p class="international-patient-summary-section-status">Section missing from document</p></section></div><div class="international-patient-summary-details"><!-- the document\'s details: title, date, authors, custodian, IPS version --></div></article>';

const meta = {
    title: "Headless/InternationalPatientSummary",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
