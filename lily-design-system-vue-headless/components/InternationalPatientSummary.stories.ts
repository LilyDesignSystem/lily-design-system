import type { Meta, StoryObj } from "@storybook/vue3-vite";
import InternationalPatientSummary from "./InternationalPatientSummary.vue";

const meta = {
    title: "Headless/InternationalPatientSummary",
    component: InternationalPatientSummary,
    tags: ["autodocs"],
} satisfies Meta<typeof InternationalPatientSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Patient summary",
        requiredHeadings: {
            medications: "Medication summary",
            allergies: "Allergies and intolerances",
            problems: "Problem list",
        },
        omittedLabel: "Section missing from document",
        contentsLabel: "Contents",
    },
};
