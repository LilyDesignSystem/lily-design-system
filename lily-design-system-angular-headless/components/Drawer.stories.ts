import type { Meta, StoryObj } from "@storybook/angular";
import { Drawer } from "./Drawer";

const meta: Meta<Drawer> = {
  title: "Headless/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Drawer>;

export const Default: Story = {};
