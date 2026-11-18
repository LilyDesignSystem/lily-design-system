import type { Meta, StoryObj } from "@storybook/vue3-vite";
import CostaRicaCedulaDeIdentidadInput from "./CostaRicaCedulaDeIdentidadInput.vue";

const meta = {
    title: "Headless/CostaRicaCedulaDeIdentidadInput",
    component: CostaRicaCedulaDeIdentidadInput,
    tags: ["autodocs"],
} satisfies Meta<typeof CostaRicaCedulaDeIdentidadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "CostaRicaCedulaDeIdentidadInput" },
};
