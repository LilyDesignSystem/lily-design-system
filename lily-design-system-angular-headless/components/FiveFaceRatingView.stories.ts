import type { Meta, StoryObj } from "@storybook/angular";
import { FiveFaceRatingView } from "./FiveFaceRatingView";

const meta: Meta<FiveFaceRatingView> = {
  title: "Headless/FiveFaceRatingView",
  component: FiveFaceRatingView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveFaceRatingView>;

export const Default: Story = {};
