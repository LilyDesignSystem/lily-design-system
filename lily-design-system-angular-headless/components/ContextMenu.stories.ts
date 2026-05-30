import type { Meta, StoryObj } from "@storybook/angular";
import { ContextMenu } from "./ContextMenu";

const meta: Meta<ContextMenu> = {
  title: "Headless/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContextMenu>;

export const Default: Story = {};
