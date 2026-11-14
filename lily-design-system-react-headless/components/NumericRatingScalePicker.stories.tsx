import type { Meta, StoryObj } from "@storybook/react-vite";
import NumericRatingScalePicker from "./NumericRatingScalePicker";

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
