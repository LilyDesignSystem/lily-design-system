import type { Meta, StoryObj } from "@storybook/angular";
import { StepListItem } from "./StepListItem";

const meta: Meta<StepListItem> = {
  title: "Headless/StepListItem",
  component: StepListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<StepListItem>;

export const Default: Story = {};
