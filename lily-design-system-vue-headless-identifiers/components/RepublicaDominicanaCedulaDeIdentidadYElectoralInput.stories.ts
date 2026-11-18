import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RepublicaDominicanaCedulaDeIdentidadYElectoralInput from "./RepublicaDominicanaCedulaDeIdentidadYElectoralInput.vue";

const meta = {
    title: "Headless/RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
    component: RepublicaDominicanaCedulaDeIdentidadYElectoralInput,
    tags: ["autodocs"],
} satisfies Meta<typeof RepublicaDominicanaCedulaDeIdentidadYElectoralInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "RepublicaDominicanaCedulaDeIdentidadYElectoralInput" },
};
