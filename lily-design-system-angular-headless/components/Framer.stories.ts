import type { Meta, StoryObj } from "@storybook/angular";
import { Framer } from "./Framer";

const meta: Meta<Framer> = {
  title: "Headless/Framer",
  component: Framer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Framer>;

export const Default: Story = {};
