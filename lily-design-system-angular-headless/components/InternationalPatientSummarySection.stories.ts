import type { Meta, StoryObj } from "@storybook/angular";
import { InternationalPatientSummarySection } from "./InternationalPatientSummarySection";

const meta: Meta<InternationalPatientSummarySection> = {
    title: "Headless/InternationalPatientSummarySection",
    component: InternationalPatientSummarySection,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InternationalPatientSummarySection>;

export const Default: Story = {
    render: () => ({
        template: `<lily-international-patient-summary-section section="problems" heading="Problem list" status="not-recorded" statusLabel="Not recorded"></lily-international-patient-summary-section>`,
    }),
};
