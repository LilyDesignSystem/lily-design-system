import type { Meta, StoryObj } from "@storybook/angular";
import { Place } from "./Place";

const meta: Meta<Place> = {
  title: "Headless/Place",
  component: Place,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Place>;

export const Default: Story = {};
