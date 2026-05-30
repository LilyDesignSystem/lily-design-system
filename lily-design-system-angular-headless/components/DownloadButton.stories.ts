import type { Meta, StoryObj } from "@storybook/angular";
import { DownloadButton } from "./DownloadButton";

const meta: Meta<DownloadButton> = {
  title: "Headless/DownloadButton",
  component: DownloadButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DownloadButton>;

export const Default: Story = {};
