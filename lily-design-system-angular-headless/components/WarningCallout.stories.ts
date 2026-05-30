import type { Meta, StoryObj } from "@storybook/angular";
import { WarningCallout } from "./WarningCallout";

const meta: Meta<WarningCallout> = {
  title: "Headless/WarningCallout",
  component: WarningCallout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<WarningCallout>;

export const Default: Story = {};
