import type { Meta, StoryObj } from "@storybook/react-vite";
import MalaysiaKadPengenalanInput from "./MalaysiaKadPengenalanInput";

const meta = {
    title: "Headless/MalaysiaKadPengenalanInput",
    component: MalaysiaKadPengenalanInput,
    tags: ["autodocs"],
} satisfies Meta<typeof MalaysiaKadPengenalanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "MalaysiaKadPengenalanInput" },
};
