import type { Meta, StoryObj } from "@storybook/vue3-vite";
import InternationalPatientSummarySection from "./InternationalPatientSummarySection.vue";

const meta = {
    title: "Headless/InternationalPatientSummarySection",
    component: InternationalPatientSummarySection,
    tags: ["autodocs"],
} satisfies Meta<typeof InternationalPatientSummarySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        section: "problems",
        heading: "Problem list",
        status: "not-recorded",
        statusLabel: "Not recorded",
    },
};
