import type { Meta, StoryObj } from "@storybook/angular";
import { MeasurementUnitView } from "./MeasurementUnitView";

const meta: Meta<MeasurementUnitView> = {
  title: "Headless/MeasurementUnitView",
  component: MeasurementUnitView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MeasurementUnitView>;

export const Default: Story = {};
