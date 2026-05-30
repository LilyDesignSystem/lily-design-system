import type { Meta, StoryObj } from "@storybook/angular";
import { FiveStarRatingPicker } from "./FiveStarRatingPicker";

const meta: Meta<FiveStarRatingPicker> = {
  title: "Headless/FiveStarRatingPicker",
  component: FiveStarRatingPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveStarRatingPicker>;

export const Default: Story = {};
