import type { Meta, StoryObj } from "@storybook/vue3-vite";
import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.vue";

const meta = {
    title: "Headless/FiveStarRatingRadioGroup",
    component: FiveStarRatingRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveStarRatingRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
