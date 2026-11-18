import type { Meta, StoryObj } from "@storybook/vue3-vite";
import MalaysiaKadPengenalanView from "./MalaysiaKadPengenalanView.vue";

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
