import type { Meta, StoryObj } from "@storybook/angular";
import { AllergyList } from "./AllergyList";

const meta: Meta<AllergyList> = {
    title: "Headless/AllergyList",
    component: AllergyList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AllergyList>;

export const Default: Story = { args: { status: "none-known", statusLabel: "No known allergies" } };
