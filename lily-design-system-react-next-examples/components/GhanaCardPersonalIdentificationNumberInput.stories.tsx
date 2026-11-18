import type { Meta, StoryObj } from "@storybook/react-vite";
import GhanaCardPersonalIdentificationNumberInput from "./GhanaCardPersonalIdentificationNumberInput";

const meta = {
    title: "Headless/GhanaCardPersonalIdentificationNumberInput",
    component: GhanaCardPersonalIdentificationNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof GhanaCardPersonalIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "GhanaCardPersonalIdentificationNumberInput" },
};
