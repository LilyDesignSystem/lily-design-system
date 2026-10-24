import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertDiv } from "./ConvertDiv";

const meta: Meta<ConvertDiv> = {
  title: "Headless/ConvertDiv",
  component: ConvertDiv,
  tags: ["autodocs"],
  args: { label: "Currency converter" },
};

export default meta;
type Story = StoryObj<ConvertDiv>;

export const Default: Story = {};
