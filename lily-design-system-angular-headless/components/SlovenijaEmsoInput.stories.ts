import type { Meta, StoryObj } from "@storybook/angular";
import { SlovenijaEmsoInput } from "./SlovenijaEmsoInput";

const meta: Meta<SlovenijaEmsoInput> = {
  title: "Headless/SlovenijaEmsoInput",
  component: SlovenijaEmsoInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlovenijaEmsoInput>;

export const Default: Story = {};
