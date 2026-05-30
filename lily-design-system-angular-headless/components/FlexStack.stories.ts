import type { Meta, StoryObj } from "@storybook/angular";
import { FlexStack } from "./FlexStack";

const meta: Meta<FlexStack> = {
  title: "Headless/FlexStack",
  component: FlexStack,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FlexStack>;

export const Default: Story = {};
