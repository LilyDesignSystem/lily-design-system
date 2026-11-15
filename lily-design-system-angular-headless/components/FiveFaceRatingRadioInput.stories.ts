import type { Meta, StoryObj } from "@storybook/angular";
import { FiveFaceRatingRadioInput } from "./FiveFaceRatingRadioInput";

const meta: Meta<FiveFaceRatingRadioInput> = {
    title: "Headless/FiveFaceRatingRadioInput",
    component: FiveFaceRatingRadioInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveFaceRatingRadioInput>;

export const Default: Story = {};
