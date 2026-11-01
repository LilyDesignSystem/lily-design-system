import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UruguayCedulaDeIdentidadView from "./UruguayCedulaDeIdentidadView.vue";

const meta = {
    title: "Headless/UruguayCedulaDeIdentidadView",
    component: UruguayCedulaDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof UruguayCedulaDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "UruguayCedulaDeIdentidadView" },
};
