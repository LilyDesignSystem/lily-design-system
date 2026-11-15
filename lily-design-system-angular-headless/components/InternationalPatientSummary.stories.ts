import type { Meta, StoryObj } from "@storybook/angular";
import { InternationalPatientSummary } from "./InternationalPatientSummary";

const meta: Meta<InternationalPatientSummary> = {
    title: "Headless/InternationalPatientSummary",
    component: InternationalPatientSummary,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InternationalPatientSummary>;

export const Default: Story = {
    render: () => ({
        props: {
            headings: {
                medications: "Medication summary",
                allergies: "Allergies and intolerances",
                problems: "Problem list",
            },
        },
        template: `<lily-international-patient-summary label="Patient summary" contentsLabel="Contents" omittedLabel="Section missing from document" [requiredHeadings]="headings"></lily-international-patient-summary>`,
    }),
};
