import type { Meta, StoryObj } from "@storybook/angular";
import { Masonry } from "./Masonry";

const meta: Meta<Masonry> = {
  title: "Headless/Masonry",
  component: Masonry,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Masonry>;

export const Default: Story = {};
