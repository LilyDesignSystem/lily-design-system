import type { Meta, StoryObj } from "@storybook/angular";
import { Carousel } from "./Carousel";

const meta: Meta<Carousel> = {
  title: "Headless/Carousel",
  component: Carousel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Carousel>;

export const Default: Story = {};
