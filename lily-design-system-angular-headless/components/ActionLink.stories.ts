import type { Meta, StoryObj } from "@storybook/angular";
import { ActionLink } from "./ActionLink";

const meta: Meta<ActionLink> = {
  title: "Headless/ActionLink",
  component: ActionLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ActionLink>;

export const Default: Story = {};
