import type { Meta, StoryObj } from "@storybook/angular";
import { FiveFaceRatingPickerButton } from "./FiveFaceRatingPickerButton";

const meta: Meta<FiveFaceRatingPickerButton> = {
  title: "Headless/FiveFaceRatingPickerButton",
  component: FiveFaceRatingPickerButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FiveFaceRatingPickerButton>;

export const Default: Story = {};
