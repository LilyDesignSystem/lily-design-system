import type { Meta, StoryObj } from "@storybook/vue3-vite";
import GuatemalaCodigoUnicoDeIdentificacionInput from "./GuatemalaCodigoUnicoDeIdentificacionInput.vue";

const meta = {
    title: "Headless/GuatemalaCodigoUnicoDeIdentificacionInput",
    component: GuatemalaCodigoUnicoDeIdentificacionInput,
    tags: ["autodocs"],
} satisfies Meta<typeof GuatemalaCodigoUnicoDeIdentificacionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "GuatemalaCodigoUnicoDeIdentificacionInput" },
};
