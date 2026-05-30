import type { Meta, StoryObj } from "@storybook/angular";
import { ReviewDate } from "./ReviewDate";

const meta: Meta<ReviewDate> = {
  title: "Headless/ReviewDate",
  component: ReviewDate,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ReviewDate>;

export const Default: Story = {};
