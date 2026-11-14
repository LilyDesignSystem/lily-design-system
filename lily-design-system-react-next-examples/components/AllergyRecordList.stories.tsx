import type { Meta, StoryObj } from "@storybook/react-vite";
import AllergyRecordList from "./AllergyRecordList";
import AllergyRecordListItem from "./AllergyRecordListItem";

const meta = {
    title: "Headless/AllergyRecordList",
    component: AllergyRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Known allergies" },
    render: (args) => (
        <AllergyRecordList {...args}>
            <AllergyRecordListItem
                substance="Penicillin"
                reaction="Anaphylaxis"
                severity="severe"
                severityLabel="Severe"
                criticality="high"
                criticalityLabel="High risk"
                clinicalStatus="active"
                clinicalStatusLabel="Active"
                verificationStatus="confirmed"
                verificationStatusLabel="Confirmed"
                typeLabel="Allergy"
                categoryLabel="Medication"
                updated="2026-11-03"
                updatedLabel="Updated 3 Nov 2026"
            />
        </AllergyRecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known allergies" },
};
