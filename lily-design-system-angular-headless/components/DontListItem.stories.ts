import type { Meta, StoryObj } from "@storybook/angular";
import { DontListItem } from "./DontListItem";

const meta: Meta<DontListItem> = {
  title: "Headless/DontListItem",
  component: DontListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DontListItem>;

export const Default: Story = {};
