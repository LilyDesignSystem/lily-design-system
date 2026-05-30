import type { Meta, StoryObj } from "@storybook/angular";
import { Separator } from "./Separator";

const meta: Meta<Separator> = {
  title: "Headless/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Separator>;

export const Default: Story = {};
