import type { Meta, StoryObj } from "@storybook/angular";
import { FiveFaceRatingRadioGroup } from "./FiveFaceRatingRadioGroup";

const meta: Meta<FiveFaceRatingRadioGroup> = {
    title: "Headless/FiveFaceRatingRadioGroup",
    component: FiveFaceRatingRadioGroup,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveFaceRatingRadioGroup>;

export const Default: Story = {};
