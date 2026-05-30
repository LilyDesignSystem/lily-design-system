import type { Meta, StoryObj } from "@storybook/angular";
import { LiechtensteinPassportNumberView } from "./LiechtensteinPassportNumberView";

const meta: Meta<LiechtensteinPassportNumberView> = {
  title: "Headless/LiechtensteinPassportNumberView",
  component: LiechtensteinPassportNumberView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LiechtensteinPassportNumberView>;

export const Default: Story = {};
