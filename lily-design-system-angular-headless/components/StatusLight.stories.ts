import type { Meta, StoryObj } from "@storybook/angular";
import { StatusLight } from "./StatusLight";

const meta: Meta<StatusLight> = {
  title: "Headless/StatusLight",
  component: StatusLight,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<StatusLight>;

export const Default: Story = {};
