import type { Meta, StoryObj } from "@storybook/angular";
import { CeskoRodneCisloInput } from "./CeskoRodneCisloInput";

const meta: Meta<CeskoRodneCisloInput> = {
  title: "Headless/CeskoRodneCisloInput",
  component: CeskoRodneCisloInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CeskoRodneCisloInput>;

export const Default: Story = {};
