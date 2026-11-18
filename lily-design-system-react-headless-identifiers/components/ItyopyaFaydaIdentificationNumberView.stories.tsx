import type { Meta, StoryObj } from "@storybook/react-vite";
import ItyopyaFaydaIdentificationNumberView from "./ItyopyaFaydaIdentificationNumberView";

const meta = {
    title: "Headless/ItyopyaFaydaIdentificationNumberView",
    component: ItyopyaFaydaIdentificationNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof ItyopyaFaydaIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "ItyopyaFaydaIdentificationNumberView" },
};
