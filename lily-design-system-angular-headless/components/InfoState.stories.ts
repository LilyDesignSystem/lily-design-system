import type { Meta, StoryObj } from "@storybook/angular";
import { InfoState } from "./InfoState";

const meta: Meta<InfoState> = {
  title: "Headless/InfoState",
  component: InfoState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InfoState>;

export const Default: Story = {};
