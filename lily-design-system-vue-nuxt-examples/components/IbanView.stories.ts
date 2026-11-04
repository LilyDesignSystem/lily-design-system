import type { Meta, StoryObj } from "@storybook/vue3-vite";
import IbanView from "./IbanView.vue";

const meta = {
    title: "Headless/IbanView",
    component: IbanView,
    tags: ["autodocs"],
} satisfies Meta<typeof IbanView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "IbanView" },
};
