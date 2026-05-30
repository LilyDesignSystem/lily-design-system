import type { Meta, StoryObj } from "@storybook/angular";
import { QrCodeImage } from "./QrCodeImage";

const meta: Meta<QrCodeImage> = {
  title: "Headless/QrCodeImage",
  component: QrCodeImage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<QrCodeImage>;

export const Default: Story = {};
