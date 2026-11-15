import type { Meta, StoryObj } from "@storybook/react-vite";
import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup";

const meta = {
    title: "Headless/FiveStarRatingRadioGroup",
    component: FiveStarRatingRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveStarRatingRadioGroup>;

export default meta;
type Story = StoryObj<typeof FiveStarRatingRadioGroup>;

export const Default: Story = {};
