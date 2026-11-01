import type { Meta, StoryObj } from "@storybook/react-vite";
import AsSaudiyahRaqmAlHuwiyahAlWataniyahInput from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahInput";

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
