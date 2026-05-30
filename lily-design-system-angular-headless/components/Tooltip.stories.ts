import type { Meta, StoryObj } from "@storybook/angular";
import { Tooltip } from "./Tooltip";

const meta: Meta<Tooltip> = {
  title: "Headless/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Tooltip>;

export const Default: Story = {};
