import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<section class="international-patient-summary-section" id="international-patient-summary-problems" aria-labelledby="international-patient-summary-problems-heading" data-section="problems" data-code="11450-4" data-status="not-recorded" data-required="true" ><h2 id="international-patient-summary-problems-heading" class="international-patient-summary-section-heading" > Problem list </h2><p class="international-patient-summary-section-status">Not recorded</p><details class="international-patient-summary-section-narrative"><summary>Narrative from the document</summary><p>No problems were recorded at discharge.</p></details></section>';

const meta = {
    title: "Headless/InternationalPatientSummarySection",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
