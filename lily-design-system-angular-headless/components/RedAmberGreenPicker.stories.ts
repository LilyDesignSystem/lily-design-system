import type { Meta, StoryObj } from "@storybook/angular";
import { RedAmberGreenPicker } from "./RedAmberGreenPicker";

const meta: Meta<RedAmberGreenPicker> = {
  title: "Headless/RedAmberGreenPicker",
  component: RedAmberGreenPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RedAmberGreenPicker>;

export const Default: Story = {};
