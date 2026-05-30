import type { Meta, StoryObj } from "@storybook/angular";
import { ResetInput } from "./ResetInput";

const meta: Meta<ResetInput> = {
  title: "Headless/ResetInput",
  component: ResetInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ResetInput>;

export const Default: Story = {};
