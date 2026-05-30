import type { Meta, StoryObj } from "@storybook/angular";
import { DialGroup } from "./DialGroup";

const meta: Meta<DialGroup> = {
  title: "Headless/DialGroup",
  component: DialGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DialGroup>;

export const Default: Story = {};
