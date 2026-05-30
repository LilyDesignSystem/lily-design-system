import type { Meta, StoryObj } from "@storybook/angular";
import { CurrencyInput } from "./CurrencyInput";

const meta: Meta<CurrencyInput> = {
  title: "Headless/CurrencyInput",
  component: CurrencyInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CurrencyInput>;

export const Default: Story = {};
