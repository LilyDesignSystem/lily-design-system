import type { Meta, StoryObj } from "@storybook/angular";
import { AllergyRecordList } from "./AllergyRecordList";

const meta: Meta<AllergyRecordList> = {
    title: "Headless/AllergyRecordList",
    component: AllergyRecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AllergyRecordList>;

export const Default: Story = { args: { status: "none-known", statusLabel: "No known allergies" } };
