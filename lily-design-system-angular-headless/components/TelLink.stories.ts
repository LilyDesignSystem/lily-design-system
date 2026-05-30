import type { Meta, StoryObj } from "@storybook/angular";
import { TelLink } from "./TelLink";

const meta: Meta<TelLink> = {
  title: "Headless/TelLink",
  component: TelLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TelLink>;

export const Default: Story = {};
