import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AsSaudiyahRaqmAlHuwiyahAlWataniyahInput from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahInput.vue";

const meta = {
    title: "Headless/AsSaudiyahRaqmAlHuwiyahAlWataniyahInput",
    component: AsSaudiyahRaqmAlHuwiyahAlWataniyahInput,
    tags: ["autodocs"],
} satisfies Meta<typeof AsSaudiyahRaqmAlHuwiyahAlWataniyahInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AsSaudiyahRaqmAlHuwiyahAlWataniyahInput" },
};
