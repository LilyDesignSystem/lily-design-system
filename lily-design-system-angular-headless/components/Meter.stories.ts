import type { Meta, StoryObj } from "@storybook/angular";
import { Meter } from "./Meter";

const meta: Meta<Meter> = {
  title: "Headless/Meter",
  component: Meter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Meter>;

export const Default: Story = {};
