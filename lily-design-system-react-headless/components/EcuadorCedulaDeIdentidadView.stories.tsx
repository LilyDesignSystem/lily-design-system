import type { Meta, StoryObj } from "@storybook/react-vite";
import EcuadorCedulaDeIdentidadView from "./EcuadorCedulaDeIdentidadView";

const meta = {
    title: "Headless/EcuadorCedulaDeIdentidadView",
    component: EcuadorCedulaDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof EcuadorCedulaDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "EcuadorCedulaDeIdentidadView" },
};
