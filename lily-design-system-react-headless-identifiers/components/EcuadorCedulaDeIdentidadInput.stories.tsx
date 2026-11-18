import type { Meta, StoryObj } from "@storybook/react-vite";
import EcuadorCedulaDeIdentidadInput from "./EcuadorCedulaDeIdentidadInput";

const meta = {
    title: "Headless/EcuadorCedulaDeIdentidadInput",
    component: EcuadorCedulaDeIdentidadInput,
    tags: ["autodocs"],
} satisfies Meta<typeof EcuadorCedulaDeIdentidadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "EcuadorCedulaDeIdentidadInput" },
};
