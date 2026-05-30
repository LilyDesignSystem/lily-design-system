import type { Meta, StoryObj } from "@storybook/angular";
import { CallToAction } from "./CallToAction";

const meta: Meta<CallToAction> = {
  title: "Headless/CallToAction",
  component: CallToAction,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CallToAction>;

export const Default: Story = {};
