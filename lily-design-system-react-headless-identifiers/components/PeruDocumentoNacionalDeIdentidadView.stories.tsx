import type { Meta, StoryObj } from "@storybook/react-vite";
import PeruDocumentoNacionalDeIdentidadView from "./PeruDocumentoNacionalDeIdentidadView";

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
