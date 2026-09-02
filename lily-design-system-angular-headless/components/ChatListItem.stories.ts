import type { Meta, StoryObj } from "@storybook/angular";
import { ChatListItem } from "./ChatListItem";

// Attribute-selector component (`li[lily-chat-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<ChatListItem> = {
  title: "Headless/ChatListItem",
  component: ChatListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ChatListItem] },
    template: `<li lily-chat-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<ChatListItem>;

export const Default: Story = {};
