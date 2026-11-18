import type { Meta, StoryObj } from "@storybook/react-vite";
import AsSaudiyahRaqmAlHuwiyahAlWataniyahView from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahView";

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
