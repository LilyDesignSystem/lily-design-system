import type { Meta, StoryObj } from "@storybook/angular";
import { Hero } from "./Hero";

const meta: Meta<Hero> = {
  title: "Headless/Hero",
  component: Hero,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Hero>;

export const Default: Story = {};
