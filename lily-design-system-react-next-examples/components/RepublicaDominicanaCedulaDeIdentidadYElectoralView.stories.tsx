import type { Meta, StoryObj } from "@storybook/react-vite";
import RepublicaDominicanaCedulaDeIdentidadYElectoralView from "./RepublicaDominicanaCedulaDeIdentidadYElectoralView";

const meta = {
    title: "Headless/RepublicaDominicanaCedulaDeIdentidadYElectoralView",
    component: RepublicaDominicanaCedulaDeIdentidadYElectoralView,
    tags: ["autodocs"],
} satisfies Meta<typeof RepublicaDominicanaCedulaDeIdentidadYElectoralView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "RepublicaDominicanaCedulaDeIdentidadYElectoralView" },
};
