import type { Meta, StoryObj } from "@storybook/angular";
import { Icon } from "./Icon";

const meta: Meta<Icon> = {
  title: "Headless/Icon",
  component: Icon,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Icon>;

export const Default: Story = {};
