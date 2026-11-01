import type { Meta, StoryObj } from "@storybook/angular";
import { AustraliaTaxFileNumberInput } from "./AustraliaTaxFileNumberInput";

const meta: Meta<AustraliaTaxFileNumberInput> = {
    title: "Headless/AustraliaTaxFileNumberInput",
    component: AustraliaTaxFileNumberInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AustraliaTaxFileNumberInput>;

export const Default: Story = {};
