import type { Meta, StoryObj } from "@storybook/angular";
import { BackLink } from "./BackLink";

const meta: Meta<BackLink> = {
  title: "Headless/BackLink",
  component: BackLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BackLink>;

export const Default: Story = {};
