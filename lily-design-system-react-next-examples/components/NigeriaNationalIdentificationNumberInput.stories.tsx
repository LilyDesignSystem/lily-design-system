import type { Meta, StoryObj } from "@storybook/react-vite";
import NigeriaNationalIdentificationNumberInput from "./NigeriaNationalIdentificationNumberInput";

const meta = {
    title: "Headless/NigeriaNationalIdentificationNumberInput",
    component: NigeriaNationalIdentificationNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof NigeriaNationalIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "NigeriaNationalIdentificationNumberInput" },
};
