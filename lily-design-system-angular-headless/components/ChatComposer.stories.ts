import type { Meta, StoryObj } from "@storybook/angular";
import { ChatComposer } from "./ChatComposer";

const meta: Meta<ChatComposer> = {
  title: "Headless/ChatComposer",
  component: ChatComposer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ChatComposer>;

export const Default: Story = {};
