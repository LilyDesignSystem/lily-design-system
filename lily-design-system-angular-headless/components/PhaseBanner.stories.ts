import type { Meta, StoryObj } from "@storybook/angular";
import { PhaseBanner } from "./PhaseBanner";

const meta: Meta<PhaseBanner> = {
  title: "Headless/PhaseBanner",
  component: PhaseBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PhaseBanner>;

export const Default: Story = {};
