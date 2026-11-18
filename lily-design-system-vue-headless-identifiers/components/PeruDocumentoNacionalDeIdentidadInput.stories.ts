import type { Meta, StoryObj } from "@storybook/vue3-vite";
import PeruDocumentoNacionalDeIdentidadInput from "./PeruDocumentoNacionalDeIdentidadInput.vue";

const meta = {
    title: "Headless/PeruDocumentoNacionalDeIdentidadInput",
    component: PeruDocumentoNacionalDeIdentidadInput,
    tags: ["autodocs"],
} satisfies Meta<typeof PeruDocumentoNacionalDeIdentidadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "PeruDocumentoNacionalDeIdentidadInput" },
};
