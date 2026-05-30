import type { Meta, StoryObj } from "@storybook/angular";
import { IconList } from "./IconList";

const meta: Meta<IconList> = {
  title: "Headless/IconList",
  component: IconList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IconList>;

export const Default: Story = {};
