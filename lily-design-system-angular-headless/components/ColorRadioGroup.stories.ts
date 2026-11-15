import type { Meta, StoryObj } from "@storybook/angular";
import { ColorRadioGroup } from "./ColorRadioGroup";

const meta: Meta<ColorRadioGroup> = {
    title: "Headless/ColorRadioGroup",
    component: ColorRadioGroup,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColorRadioGroup>;

export const Default: Story = {};
