import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AlImaratRaqmAlHuwiyahInput from "./AlImaratRaqmAlHuwiyahInput.vue";

const meta = {
    title: "Headless/AlImaratRaqmAlHuwiyahInput",
    component: AlImaratRaqmAlHuwiyahInput,
    tags: ["autodocs"],
} satisfies Meta<typeof AlImaratRaqmAlHuwiyahInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AlImaratRaqmAlHuwiyahInput" },
};
