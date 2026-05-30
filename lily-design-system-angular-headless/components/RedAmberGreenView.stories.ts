import type { Meta, StoryObj } from "@storybook/angular";
import { RedAmberGreenView } from "./RedAmberGreenView";

const meta: Meta<RedAmberGreenView> = {
  title: "Headless/RedAmberGreenView",
  component: RedAmberGreenView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RedAmberGreenView>;

export const Default: Story = {};
