import type { Meta, StoryObj } from "@storybook/angular";
import { LiechtensteinPassportNumberInput } from "./LiechtensteinPassportNumberInput";

const meta: Meta<LiechtensteinPassportNumberInput> = {
  title: "Headless/LiechtensteinPassportNumberInput",
  component: LiechtensteinPassportNumberInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LiechtensteinPassportNumberInput>;

export const Default: Story = {};
