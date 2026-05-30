import type { Meta, StoryObj } from "@storybook/angular";
import { ValidationListItem } from "./ValidationListItem";

const meta: Meta<ValidationListItem> = {
  title: "Headless/ValidationListItem",
  component: ValidationListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ValidationListItem>;

export const Default: Story = {};
