import type { Meta, StoryObj } from "@storybook/react-vite";
import InternationalPatientSummary from "./InternationalPatientSummary";

const meta = {
    title: "Headless/InternationalPatientSummary",
    component: InternationalPatientSummary,
    tags: ["autodocs"],
} satisfies Meta<typeof InternationalPatientSummary>;

export default meta;
type Story = StoryObj<typeof InternationalPatientSummary>;

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
