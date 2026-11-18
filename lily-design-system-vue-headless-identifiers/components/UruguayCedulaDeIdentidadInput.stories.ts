import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UruguayCedulaDeIdentidadInput from "./UruguayCedulaDeIdentidadInput.vue";

const meta = {
    title: "Headless/UruguayCedulaDeIdentidadInput",
    component: UruguayCedulaDeIdentidadInput,
    tags: ["autodocs"],
} satisfies Meta<typeof UruguayCedulaDeIdentidadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "UruguayCedulaDeIdentidadInput" },
};
