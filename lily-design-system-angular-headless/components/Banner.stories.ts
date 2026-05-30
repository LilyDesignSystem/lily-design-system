import type { Meta, StoryObj } from "@storybook/angular";
import { Banner } from "./Banner";

const meta: Meta<Banner> = {
  title: "Headless/Banner",
  component: Banner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Banner>;

export const Default: Story = {};
