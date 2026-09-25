import type { Meta, StoryObj } from "@storybook/angular";
import { BharatAadhaarView } from "./BharatAadhaarView";

const meta: Meta<BharatAadhaarView> = {
  title: "Headless/BharatAadhaarView",
  component: BharatAadhaarView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BharatAadhaarView>;

export const Default: Story = {};
