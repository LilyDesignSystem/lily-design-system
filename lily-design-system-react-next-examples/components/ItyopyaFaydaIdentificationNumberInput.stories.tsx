import type { Meta, StoryObj } from "@storybook/react-vite";
import ItyopyaFaydaIdentificationNumberInput from "./ItyopyaFaydaIdentificationNumberInput";

const meta = {
    title: "Headless/ItyopyaFaydaIdentificationNumberInput",
    component: ItyopyaFaydaIdentificationNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof ItyopyaFaydaIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "ItyopyaFaydaIdentificationNumberInput" },
};
