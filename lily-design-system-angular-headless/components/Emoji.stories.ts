import type { Meta, StoryObj } from "@storybook/angular";
import { Emoji } from "./Emoji";

const meta: Meta<Emoji> = {
  title: "Headless/Emoji",
  component: Emoji,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Emoji>;

export const Default: Story = {};
