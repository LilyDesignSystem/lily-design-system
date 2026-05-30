import type { Meta, StoryObj } from "@storybook/angular";
import { ContentsLink } from "./ContentsLink";

const meta: Meta<ContentsLink> = {
  title: "Headless/ContentsLink",
  component: ContentsLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContentsLink>;

export const Default: Story = {};
