import type { Meta, StoryObj } from "@storybook/react-vite";
import AustraliaTaxFileNumberInput from "./AustraliaTaxFileNumberInput";

const meta = {
    title: "Headless/AustraliaTaxFileNumberInput",
    component: AustraliaTaxFileNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof AustraliaTaxFileNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AustraliaTaxFileNumberInput" },
};
