import type { Meta, StoryObj } from "@storybook/angular";
import { BarcodeImage } from "./BarcodeImage";

const meta: Meta<BarcodeImage> = {
  title: "Headless/BarcodeImage",
  component: BarcodeImage,
  tags: ["autodocs"],
  args: {
    src: "data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%2240%22%3E%3Crect width=%22160%22 height=%2240%22 fill=%22white%22/%3E%3C/svg%3E",
    alt: "Order number 12345",
  },
};

export default meta;
type Story = StoryObj<BarcodeImage>;

export const Default: Story = {};
