import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AlImaratRaqmAlHuwiyahView from "./AlImaratRaqmAlHuwiyahView.vue";

const meta = {
    title: "Headless/AlImaratRaqmAlHuwiyahView",
    component: AlImaratRaqmAlHuwiyahView,
    tags: ["autodocs"],
} satisfies Meta<typeof AlImaratRaqmAlHuwiyahView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AlImaratRaqmAlHuwiyahView" },
};
