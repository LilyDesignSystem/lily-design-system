import type { Meta, StoryObj } from "@storybook/react-vite";
import FiveFaceRatingRadioInput from "./FiveFaceRatingRadioInput";

const meta = {
    title: "Headless/FiveFaceRatingRadioInput",
    component: FiveFaceRatingRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof FiveFaceRatingRadioInput>;

export default meta;
type Story = StoryObj<typeof FiveFaceRatingRadioInput>;

export const Default: Story = {};
