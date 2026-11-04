import type { Meta, StoryObj } from "@storybook/vue3-vite";
import IbanInput from "./IbanInput.vue";

const meta = {
    title: "Headless/IbanInput",
    component: IbanInput,
    tags: ["autodocs"],
} satisfies Meta<typeof IbanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "IbanInput" },
};
