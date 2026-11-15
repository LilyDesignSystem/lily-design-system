import type { Meta, StoryObj } from "@storybook/react-vite";
import InternationalPatientSummarySection from "./InternationalPatientSummarySection";

const meta = {
    title: "Headless/InternationalPatientSummarySection",
    component: InternationalPatientSummarySection,
    tags: ["autodocs"],
} satisfies Meta<typeof InternationalPatientSummarySection>;

export default meta;
type Story = StoryObj<typeof InternationalPatientSummarySection>;

export const Default: Story = {
    args: {
        section: "problems",
        heading: "Problem list",
        status: "not-recorded",
        statusLabel: "Not recorded",
    },
};
