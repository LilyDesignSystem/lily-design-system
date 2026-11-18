import type { Meta, StoryObj } from "@storybook/vue3-vite";
import CostaRicaCedulaDeIdentidadView from "./CostaRicaCedulaDeIdentidadView.vue";

const meta = {
    title: "Headless/CostaRicaCedulaDeIdentidadView",
    component: CostaRicaCedulaDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof CostaRicaCedulaDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "CostaRicaCedulaDeIdentidadView" },
};
