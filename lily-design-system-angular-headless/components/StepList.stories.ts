import type { Meta, StoryObj } from "@storybook/angular";
import { StepList } from "./StepList";

const meta: Meta<StepList> = {
  title: "Headless/StepList",
  component: StepList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<StepList>;

export const Default: Story = {};
