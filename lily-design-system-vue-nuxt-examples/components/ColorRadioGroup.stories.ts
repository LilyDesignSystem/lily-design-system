import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ColorRadioGroup from "./ColorRadioGroup.vue";

const meta = {
    title: "Headless/ColorRadioGroup",
    component: ColorRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof ColorRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
