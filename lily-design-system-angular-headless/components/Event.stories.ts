import type { Meta, StoryObj } from "@storybook/angular";
import { Event } from "./Event";

const meta: Meta<Event> = {
  title: "Headless/Event",
  component: Event,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Event>;

export const Default: Story = {};
