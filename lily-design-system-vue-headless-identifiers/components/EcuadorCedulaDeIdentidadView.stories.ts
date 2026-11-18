import type { Meta, StoryObj } from "@storybook/vue3-vite";
import EcuadorCedulaDeIdentidadView from "./EcuadorCedulaDeIdentidadView.vue";

const meta = {
    title: "Headless/EcuadorCedulaDeIdentidadView",
    component: EcuadorCedulaDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof EcuadorCedulaDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "EcuadorCedulaDeIdentidadView" },
};
