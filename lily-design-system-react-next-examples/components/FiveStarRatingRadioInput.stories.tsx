import type { Meta, StoryObj } from "@storybook/react-vite";
import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput";

const meta = {
    title: "Headless/FiveStarRatingRadioInput",
    component: FiveStarRatingRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveStarRatingRadioInput>;

export default meta;
type Story = StoryObj<typeof FiveStarRatingRadioInput>;

export const Default: Story = {};
