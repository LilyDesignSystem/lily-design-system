import type { Meta, StoryObj } from "@storybook/angular";
import { HeroHeadline } from "./HeroHeadline";

const meta: Meta<HeroHeadline> = {
  title: "Headless/HeroHeadline",
  component: HeroHeadline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HeroHeadline>;

export const Default: Story = {};
