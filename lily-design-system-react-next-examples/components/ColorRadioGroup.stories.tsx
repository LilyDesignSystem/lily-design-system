import type { Meta, StoryObj } from "@storybook/react-vite";
import ColorRadioGroup from "./ColorRadioGroup";

const meta = {
    title: "Headless/ColorRadioGroup",
    component: ColorRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof ColorRadioGroup>;

export default meta;
type Story = StoryObj<typeof ColorRadioGroup>;

export const Default: Story = {};
