import type { Meta, StoryObj } from "@storybook/angular";
import { HoverCard } from "./HoverCard";

const meta: Meta<HoverCard> = {
  title: "Headless/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HoverCard>;

export const Default: Story = {};
