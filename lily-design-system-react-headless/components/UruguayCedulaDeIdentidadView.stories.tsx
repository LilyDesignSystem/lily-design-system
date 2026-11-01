import type { Meta, StoryObj } from "@storybook/react-vite";
import UruguayCedulaDeIdentidadView from "./UruguayCedulaDeIdentidadView";

const meta = {
    title: "Headless/UruguayCedulaDeIdentidadView",
    component: UruguayCedulaDeIdentidadView,
    tags: ["autodocs"],
} satisfies Meta<typeof UruguayCedulaDeIdentidadView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "UruguayCedulaDeIdentidadView" },
};
