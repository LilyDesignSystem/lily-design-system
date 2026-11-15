import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput.vue";

const meta = {
    title: "Headless/RedAmberGreenRadioInput",
    component: RedAmberGreenRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof RedAmberGreenRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
