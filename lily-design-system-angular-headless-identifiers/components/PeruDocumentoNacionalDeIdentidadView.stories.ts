import type { Meta, StoryObj } from "@storybook/angular";
import { PeruDocumentoNacionalDeIdentidadView } from "./PeruDocumentoNacionalDeIdentidadView";

const meta: Meta<PeruDocumentoNacionalDeIdentidadView> = {
    title: "Headless/PeruDocumentoNacionalDeIdentidadView",
    component: PeruDocumentoNacionalDeIdentidadView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PeruDocumentoNacionalDeIdentidadView>;

export const Default: Story = {};
