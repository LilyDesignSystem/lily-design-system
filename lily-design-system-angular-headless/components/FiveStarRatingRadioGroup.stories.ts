import type { Meta, StoryObj } from "@storybook/angular";
import { FiveStarRatingRadioGroup } from "./FiveStarRatingRadioGroup";

const meta: Meta<FiveStarRatingRadioGroup> = {
    title: "Headless/FiveStarRatingRadioGroup",
    component: FiveStarRatingRadioGroup,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveStarRatingRadioGroup>;

export const Default: Story = {};
