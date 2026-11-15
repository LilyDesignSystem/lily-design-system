import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RedAmberGreenRadioGroup from "./RedAmberGreenRadioGroup.vue";

const meta = {
    title: "Headless/RedAmberGreenRadioGroup",
    component: RedAmberGreenRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof RedAmberGreenRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
