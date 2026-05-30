import type { Meta, StoryObj } from "@storybook/angular";
import { MeasurementUnitInput } from "./MeasurementUnitInput";

const meta: Meta<MeasurementUnitInput> = {
  title: "Headless/MeasurementUnitInput",
  component: MeasurementUnitInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MeasurementUnitInput>;

export const Default: Story = {};
