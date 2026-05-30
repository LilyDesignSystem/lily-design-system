import type { Meta, StoryObj } from "@storybook/angular";
import { ChatMessage } from "./ChatMessage";

const meta: Meta<ChatMessage> = {
  title: "Headless/ChatMessage",
  component: ChatMessage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ChatMessage>;

export const Default: Story = {};
