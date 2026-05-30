import type { Meta, StoryObj } from "@storybook/angular";
import { StatusTag } from "./StatusTag";

const meta: Meta<StatusTag> = {
  title: "Headless/StatusTag",
  component: StatusTag,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<StatusTag>;

export const Default: Story = {};
