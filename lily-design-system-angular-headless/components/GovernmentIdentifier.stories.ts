import type { Meta, StoryObj } from "@storybook/angular";
import { GovernmentIdentifier } from "./GovernmentIdentifier";

const meta: Meta<GovernmentIdentifier> = {
  title: "Headless/GovernmentIdentifier",
  component: GovernmentIdentifier,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GovernmentIdentifier>;

export const Default: Story = {};
