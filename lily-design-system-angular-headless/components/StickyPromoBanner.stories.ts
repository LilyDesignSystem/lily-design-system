import type { Meta, StoryObj } from "@storybook/angular";
import { StickyPromoBanner } from "./StickyPromoBanner";

const meta: Meta<StickyPromoBanner> = {
  title: "Headless/StickyPromoBanner",
  component: StickyPromoBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<StickyPromoBanner>;

export const Default: Story = {};
