import type { Meta, StoryObj } from "@storybook/angular";
import { ActionGroup } from "./ActionGroup";

const meta: Meta<ActionGroup> = {
  title: "Headless/ActionGroup",
  component: ActionGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ActionGroup>;

export const Default: Story = {};
