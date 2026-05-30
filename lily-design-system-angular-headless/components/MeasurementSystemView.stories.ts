import type { Meta, StoryObj } from "@storybook/angular";
import { MeasurementSystemView } from "./MeasurementSystemView";

const meta: Meta<MeasurementSystemView> = {
  title: "Headless/MeasurementSystemView",
  component: MeasurementSystemView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MeasurementSystemView>;

export const Default: Story = {};
