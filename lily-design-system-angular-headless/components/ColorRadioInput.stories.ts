import type { Meta, StoryObj } from "@storybook/angular";
import { ColorRadioInput } from "./ColorRadioInput";

const meta: Meta<ColorRadioInput> = {
    title: "Headless/ColorRadioInput",
    component: ColorRadioInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColorRadioInput>;

export const Default: Story = {};
