import type { Meta, StoryObj } from "@storybook/react-vite";
import CostaRicaCedulaDeIdentidadInput from "./CostaRicaCedulaDeIdentidadInput";

const meta = {
    title: "Headless/CostaRicaCedulaDeIdentidadInput",
    component: CostaRicaCedulaDeIdentidadInput,
    tags: ["autodocs"],
} satisfies Meta<typeof CostaRicaCedulaDeIdentidadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "CostaRicaCedulaDeIdentidadInput" },
};
