import type { Meta, StoryObj } from "@storybook/angular";
import { Popover } from "./Popover";

const meta: Meta<Popover> = {
  title: "Headless/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Popover>;

export const Default: Story = {};
