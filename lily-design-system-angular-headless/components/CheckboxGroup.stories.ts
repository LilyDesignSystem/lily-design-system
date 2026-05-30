import type { Meta, StoryObj } from "@storybook/angular";
import { CheckboxGroup } from "./CheckboxGroup";

const meta: Meta<CheckboxGroup> = {
  title: "Headless/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CheckboxGroup>;

export const Default: Story = {};
