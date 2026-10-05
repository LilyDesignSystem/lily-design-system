import type { Meta, StoryObj } from "@storybook/angular";
import { Mark } from "./Mark";

const meta: Meta<Mark> = {
  title: "Headless/Mark",
  component: Mark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Mark>;

export const Default: Story = {};
