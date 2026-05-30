import type { Meta, StoryObj } from "@storybook/angular";
import { ContextMenuItem } from "./ContextMenuItem";

const meta: Meta<ContextMenuItem> = {
  title: "Headless/ContextMenuItem",
  component: ContextMenuItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContextMenuItem>;

export const Default: Story = {};
