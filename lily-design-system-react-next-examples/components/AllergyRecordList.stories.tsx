import type { Meta, StoryObj } from "@storybook/react-vite";
import AllergyRecordList from "./AllergyRecordList";

const meta = {
    title: "Headless/AllergyRecordList",
    component: AllergyRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { status: "none-known", statusLabel: "No known allergies" } };
