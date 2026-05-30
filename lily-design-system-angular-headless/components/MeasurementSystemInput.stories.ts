import type { Meta, StoryObj } from "@storybook/angular";
import { MeasurementSystemInput } from "./MeasurementSystemInput";

const meta: Meta<MeasurementSystemInput> = {
  title: "Headless/MeasurementSystemInput",
  component: MeasurementSystemInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MeasurementSystemInput>;

export const Default: Story = {};
