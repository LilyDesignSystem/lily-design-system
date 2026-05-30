import type { Meta, StoryObj } from "@storybook/angular";
import { SlovenskoRodneCisloInput } from "./SlovenskoRodneCisloInput";

const meta: Meta<SlovenskoRodneCisloInput> = {
  title: "Headless/SlovenskoRodneCisloInput",
  component: SlovenskoRodneCisloInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlovenskoRodneCisloInput>;

export const Default: Story = {};
