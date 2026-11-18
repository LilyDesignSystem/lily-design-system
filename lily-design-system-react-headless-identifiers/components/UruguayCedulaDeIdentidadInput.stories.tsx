import type { Meta, StoryObj } from "@storybook/react-vite";
import UruguayCedulaDeIdentidadInput from "./UruguayCedulaDeIdentidadInput";

const meta = {
    title: "Headless/UruguayCedulaDeIdentidadInput",
    component: UruguayCedulaDeIdentidadInput,
    tags: ["autodocs"],
} satisfies Meta<typeof UruguayCedulaDeIdentidadInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "UruguayCedulaDeIdentidadInput" },
};
