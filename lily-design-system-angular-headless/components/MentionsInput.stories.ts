import type { Meta, StoryObj } from "@storybook/angular";
import { MentionsInput } from "./MentionsInput";

const meta: Meta<MentionsInput> = {
  title: "Headless/MentionsInput",
  component: MentionsInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MentionsInput>;

export const Default: Story = {};
