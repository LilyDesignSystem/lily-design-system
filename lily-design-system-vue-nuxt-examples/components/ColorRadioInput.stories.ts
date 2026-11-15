import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ColorRadioInput from "./ColorRadioInput.vue";

const meta = {
    title: "Headless/ColorRadioInput",
    component: ColorRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof ColorRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
