import type { Meta, StoryObj } from "@storybook/angular";
import { FiveFaceRatingPicker } from "./FiveFaceRatingPicker";

const meta: Meta<FiveFaceRatingPicker> = {
  title: "Headless/FiveFaceRatingPicker",
  component: FiveFaceRatingPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveFaceRatingPicker>;

export const Default: Story = {};
