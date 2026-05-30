import type { Meta, StoryObj } from "@storybook/angular";
import { ContentsNav } from "./ContentsNav";

const meta: Meta<ContentsNav> = {
  title: "Headless/ContentsNav",
  component: ContentsNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContentsNav>;

export const Default: Story = {};
