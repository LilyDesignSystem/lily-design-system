import type { Meta, StoryObj } from "@storybook/angular";
import { Image } from "./Image";

const meta: Meta<Image> = {
  title: "Headless/Image",
  component: Image,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Image>;

export const Default: Story = {};
