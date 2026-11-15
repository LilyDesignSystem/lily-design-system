import type { Meta, StoryObj } from "@storybook/vue3-vite";
import FiveFaceRatingRadioInput from "./FiveFaceRatingRadioInput.vue";

const meta = {
    title: "Headless/FiveFaceRatingRadioInput",
    component: FiveFaceRatingRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveFaceRatingRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
