import type { Meta, StoryObj } from "@storybook/angular";
import { SuccessPanel } from "./SuccessPanel";

const meta: Meta<SuccessPanel> = {
  title: "Headless/SuccessPanel",
  component: SuccessPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SuccessPanel>;

export const Default: Story = {};
