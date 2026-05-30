import type { Meta, StoryObj } from "@storybook/angular";
import { Headline } from "./Headline";

const meta: Meta<Headline> = {
  title: "Headless/Headline",
  component: Headline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Headline>;

export const Default: Story = {};
