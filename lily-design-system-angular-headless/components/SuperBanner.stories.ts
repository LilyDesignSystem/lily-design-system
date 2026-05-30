import type { Meta, StoryObj } from "@storybook/angular";
import { SuperBanner } from "./SuperBanner";

const meta: Meta<SuperBanner> = {
  title: "Headless/SuperBanner",
  component: SuperBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SuperBanner>;

export const Default: Story = {};
