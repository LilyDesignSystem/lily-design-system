import type { Meta, StoryObj } from "@storybook/angular";
import { MockupShell } from "./MockupShell";

const meta: Meta<MockupShell> = {
  title: "Headless/MockupShell",
  component: MockupShell,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupShell>;

export const Default: Story = {};
