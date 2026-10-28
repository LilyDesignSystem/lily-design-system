import type { Meta, StoryObj } from "@storybook/angular";
import { Picture } from "./Picture";

const meta: Meta<Picture> = {
  title: "Headless/Picture",
  component: Picture,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Picture>;

export const Default: Story = {};
