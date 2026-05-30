import type { Meta, StoryObj } from "@storybook/angular";
import { ChatListItem } from "./ChatListItem";

const meta: Meta<ChatListItem> = {
  title: "Headless/ChatListItem",
  component: ChatListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ChatListItem>;

export const Default: Story = {};
