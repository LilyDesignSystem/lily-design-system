import type { Meta, StoryObj } from "@storybook/angular";
import { QrCode } from "./QrCode";

const meta: Meta<QrCode> = {
  title: "Headless/QrCode",
  component: QrCode,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<QrCode>;

export const Default: Story = {};
