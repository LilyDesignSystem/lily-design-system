import type { Meta, StoryObj } from "@storybook/angular";
import { FiveStarRatingView } from "./FiveStarRatingView";

const meta: Meta<FiveStarRatingView> = {
  title: "Headless/FiveStarRatingView",
  component: FiveStarRatingView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveStarRatingView>;

export const Default: Story = {};
