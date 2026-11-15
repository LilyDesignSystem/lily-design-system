import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<section\n  class="international-patient-summary-section"\n  id="international-patient-summary-problems"\n  aria-labelledby="international-patient-summary-problems-heading"\n  data-section="problems"\n  data-code="11450-4"\n  data-status="not-recorded"\n  data-required="true"\n>\n  <h2\n    id="international-patient-summary-problems-heading"\n    class="international-patient-summary-section-heading"\n  >\n    Problem list\n  </h2>\n  <p class="international-patient-summary-section-status">Not recorded</p>\n  <details class="international-patient-summary-section-narrative">\n    <summary>Narrative from the document</summary>\n    <p>No problems were recorded at discharge.</p>\n  </details>\n</section>';

const meta = {
    title: "Headless/International Patient Summary Section",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
