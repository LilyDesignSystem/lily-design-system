import type { Meta, StoryObj } from "@storybook/angular";
import { ShowMore } from "./ShowMore";

const meta: Meta<ShowMore> = {
  title: "Headless/ShowMore",
  component: ShowMore,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ShowMore>;

export const Default: Story = {
  args: { moreLabel: "Show more", lessLabel: "Show less" },
};
