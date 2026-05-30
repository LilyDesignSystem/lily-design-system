import type { Meta, StoryObj } from "@storybook/angular";
import { GovernmentBanner } from "./GovernmentBanner";

const meta: Meta<GovernmentBanner> = {
  title: "Headless/GovernmentBanner",
  component: GovernmentBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GovernmentBanner>;

export const Default: Story = {};
