import type { Meta, StoryObj } from "@storybook/angular";
import { Scroller } from "./Scroller";

const meta: Meta<Scroller> = {
  title: "Headless/Scroller",
  component: Scroller,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Scroller>;

export const Default: Story = {};
