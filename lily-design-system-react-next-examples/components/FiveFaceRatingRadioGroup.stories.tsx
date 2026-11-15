import type { Meta, StoryObj } from "@storybook/react-vite";
import FiveFaceRatingRadioGroup from "./FiveFaceRatingRadioGroup";

const meta = {
    title: "Headless/FiveFaceRatingRadioGroup",
    component: FiveFaceRatingRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveFaceRatingRadioGroup>;

export default meta;
type Story = StoryObj<typeof FiveFaceRatingRadioGroup>;

export const Default: Story = {};
