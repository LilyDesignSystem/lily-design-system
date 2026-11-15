import type { Meta, StoryObj } from "@storybook/react-vite";
import ColorRadioInput from "./ColorRadioInput";

const meta = {
    title: "Headless/ColorRadioInput",
    component: ColorRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof ColorRadioInput>;

export default meta;
type Story = StoryObj<typeof ColorRadioInput>;

export const Default: Story = {};
