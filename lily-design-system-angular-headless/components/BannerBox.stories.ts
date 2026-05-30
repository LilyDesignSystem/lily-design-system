import type { Meta, StoryObj } from "@storybook/angular";
import { BannerBox } from "./BannerBox";

const meta: Meta<BannerBox> = {
  title: "Headless/BannerBox",
  component: BannerBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BannerBox>;

export const Default: Story = {};
