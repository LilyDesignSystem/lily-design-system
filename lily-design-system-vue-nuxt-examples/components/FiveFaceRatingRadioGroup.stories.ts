import type { Meta, StoryObj } from "@storybook/vue3-vite";
import FiveFaceRatingRadioGroup from "./FiveFaceRatingRadioGroup.vue";

const meta = {
    title: "Headless/FiveFaceRatingRadioGroup",
    component: FiveFaceRatingRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveFaceRatingRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
