import type { Meta, StoryObj } from "@storybook/vue3-vite";
import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput.vue";

const meta = {
    title: "Headless/FiveStarRatingRadioInput",
    component: FiveStarRatingRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveStarRatingRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
