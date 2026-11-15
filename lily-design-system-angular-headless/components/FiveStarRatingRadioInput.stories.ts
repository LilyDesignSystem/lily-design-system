import type { Meta, StoryObj } from "@storybook/angular";
import { FiveStarRatingRadioInput } from "./FiveStarRatingRadioInput";

const meta: Meta<FiveStarRatingRadioInput> = {
    title: "Headless/FiveStarRatingRadioInput",
    component: FiveStarRatingRadioInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveStarRatingRadioInput>;

export const Default: Story = {};
