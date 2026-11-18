import type { Meta, StoryObj } from "@storybook/react-vite";
import GuatemalaCodigoUnicoDeIdentificacionInput from "./GuatemalaCodigoUnicoDeIdentificacionInput";

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
