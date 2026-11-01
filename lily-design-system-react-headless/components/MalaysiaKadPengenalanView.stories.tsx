import type { Meta, StoryObj } from "@storybook/react-vite";
import MalaysiaKadPengenalanView from "./MalaysiaKadPengenalanView";

const meta = {
    title: "Headless/MalaysiaKadPengenalanView",
    component: MalaysiaKadPengenalanView,
    tags: ["autodocs"],
} satisfies Meta<typeof MalaysiaKadPengenalanView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "MalaysiaKadPengenalanView" },
};
