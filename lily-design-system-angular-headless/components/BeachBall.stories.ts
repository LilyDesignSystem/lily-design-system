import type { Meta, StoryObj } from "@storybook/angular";
import { BeachBall } from "./BeachBall";

const meta: Meta<BeachBall> = {
  title: "Headless/BeachBall",
  component: BeachBall,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BeachBall>;

export const Default: Story = {};
