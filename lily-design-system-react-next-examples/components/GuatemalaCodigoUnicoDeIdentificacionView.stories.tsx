import type { Meta, StoryObj } from "@storybook/react-vite";
import GuatemalaCodigoUnicoDeIdentificacionView from "./GuatemalaCodigoUnicoDeIdentificacionView";

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
