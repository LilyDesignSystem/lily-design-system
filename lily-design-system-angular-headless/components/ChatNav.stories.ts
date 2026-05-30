import type { Meta, StoryObj } from "@storybook/angular";
import { ChatNav } from "./ChatNav";

const meta: Meta<ChatNav> = {
  title: "Headless/ChatNav",
  component: ChatNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ChatNav>;

export const Default: Story = {};
