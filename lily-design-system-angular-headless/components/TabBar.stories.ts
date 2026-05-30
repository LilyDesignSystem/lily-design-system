import type { Meta, StoryObj } from "@storybook/angular";
import { TabBar } from "./TabBar";

const meta: Meta<TabBar> = {
  title: "Headless/TabBar",
  component: TabBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TabBar>;

export const Default: Story = {};
