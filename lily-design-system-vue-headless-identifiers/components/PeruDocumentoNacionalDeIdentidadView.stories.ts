import type { Meta, StoryObj } from "@storybook/vue3-vite";
import PeruDocumentoNacionalDeIdentidadView from "./PeruDocumentoNacionalDeIdentidadView.vue";

const meta = {
    title: "Headless/PeruDocumentoNacionalDeIdentidadView",
    component: PeruDocumentoNacionalDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof PeruDocumentoNacionalDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "PeruDocumentoNacionalDeIdentidadView" },
};
