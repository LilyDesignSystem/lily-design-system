import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AsSaudiyahRaqmAlHuwiyahAlWataniyahView from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahView.vue";

const meta = {
    title: "Headless/AsSaudiyahRaqmAlHuwiyahAlWataniyahView",
    component: AsSaudiyahRaqmAlHuwiyahAlWataniyahView,
    tags: ["autodocs"],
} satisfies Meta<typeof AsSaudiyahRaqmAlHuwiyahAlWataniyahView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AsSaudiyahRaqmAlHuwiyahAlWataniyahView" },
};
