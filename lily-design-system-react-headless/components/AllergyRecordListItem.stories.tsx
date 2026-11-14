import type { Meta, StoryObj } from "@storybook/react-vite";
import AllergyRecordListItem from "./AllergyRecordListItem";

const meta = {
    title: "Headless/AllergyRecordListItem",
    component: AllergyRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        substance: "Penicillin",
        reaction: "Anaphylaxis",
        severity: "severe",
        severityLabel: "Severe",
        criticality: "high",
        criticalityLabel: "High risk",
        clinicalStatus: "active",
        clinicalStatusLabel: "Active",
        verificationStatus: "confirmed",
        verificationStatusLabel: "Confirmed",
        typeLabel: "Allergy",
        categoryLabel: "Medication",
        updated: "2026-11-03",
        updatedLabel: "Updated 3 Nov 2026",
    },
    render: (args) => (
        <ul>
            <AllergyRecordListItem {...args}></AllergyRecordListItem>
        </ul>
    ),
};
