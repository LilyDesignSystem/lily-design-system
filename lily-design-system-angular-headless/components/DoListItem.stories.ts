import type { Meta, StoryObj } from "@storybook/angular";
import { DoListItem } from "./DoListItem";

const meta: Meta<DoListItem> = {
  title: "Headless/DoListItem",
  component: DoListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DoListItem>;

export const Default: Story = {};
