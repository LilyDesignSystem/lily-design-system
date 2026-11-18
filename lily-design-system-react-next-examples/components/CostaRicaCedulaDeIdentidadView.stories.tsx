import type { Meta, StoryObj } from "@storybook/react-vite";
import CostaRicaCedulaDeIdentidadView from "./CostaRicaCedulaDeIdentidadView";

const meta = {
    title: "Headless/CostaRicaCedulaDeIdentidadView",
    component: CostaRicaCedulaDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof CostaRicaCedulaDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "CostaRicaCedulaDeIdentidadView" },
};
