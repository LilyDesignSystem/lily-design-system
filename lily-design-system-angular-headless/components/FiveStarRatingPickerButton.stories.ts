import type { Meta, StoryObj } from "@storybook/angular";
import { FiveStarRatingPickerButton } from "./FiveStarRatingPickerButton";

const meta: Meta<FiveStarRatingPickerButton> = {
  title: "Headless/FiveStarRatingPickerButton",
  component: FiveStarRatingPickerButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveStarRatingPickerButton>;

export const Default: Story = {};
