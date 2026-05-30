import type { Meta, StoryObj } from "@storybook/angular";
import { ChatList } from "./ChatList";

const meta: Meta<ChatList> = {
  title: "Headless/ChatList",
  component: ChatList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ChatList>;

export const Default: Story = {};
