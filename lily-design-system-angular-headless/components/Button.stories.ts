import type { Meta, StoryObj } from "@storybook/angular";
import { Button } from "./Button";

const meta: Meta<Button> = {
  title: "Headless/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {};
