import type { Meta, StoryObj } from "@storybook/vue3-vite";
import GuatemalaCodigoUnicoDeIdentificacionView from "./GuatemalaCodigoUnicoDeIdentificacionView.vue";

const meta = {
    title: "Headless/GuatemalaCodigoUnicoDeIdentificacionView",
    component: GuatemalaCodigoUnicoDeIdentificacionView,
    tags: ["autodocs"],
} satisfies Meta<typeof GuatemalaCodigoUnicoDeIdentificacionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "GuatemalaCodigoUnicoDeIdentificacionView" },
};
