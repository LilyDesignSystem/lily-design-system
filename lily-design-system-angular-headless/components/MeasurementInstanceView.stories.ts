import type { Meta, StoryObj } from "@storybook/angular";
import { MeasurementInstanceView } from "./MeasurementInstanceView";

const meta: Meta<MeasurementInstanceView> = {
  title: "Headless/MeasurementInstanceView",
  component: MeasurementInstanceView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MeasurementInstanceView>;

export const Default: Story = {};
