import type { Meta, StoryObj } from "@storybook/vue3-vite";
import NumericRatingScalePicker from "./NumericRatingScalePicker.vue";

const meta = {
    title: "Headless/NumericRatingScalePicker",
    component: NumericRatingScalePicker,
    tags: ["autodocs"],
} satisfies Meta<typeof NumericRatingScalePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "How bad is your pain now?",
        minLabel: "No pain",
        maxLabel: "Worst pain imaginable",
    },
};
