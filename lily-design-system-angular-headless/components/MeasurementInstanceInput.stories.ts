import type { Meta, StoryObj } from "@storybook/angular";
import { MeasurementInstanceInput } from "./MeasurementInstanceInput";

const meta: Meta<MeasurementInstanceInput> = {
  title: "Headless/MeasurementInstanceInput",
  component: MeasurementInstanceInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MeasurementInstanceInput>;

export const Default: Story = {};
