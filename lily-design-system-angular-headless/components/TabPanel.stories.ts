import type { Meta, StoryObj } from "@storybook/angular";
import { TabPanel } from "./TabPanel";

const meta: Meta<TabPanel> = {
  title: "Headless/TabPanel",
  component: TabPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TabPanel>;

export const Default: Story = {};
