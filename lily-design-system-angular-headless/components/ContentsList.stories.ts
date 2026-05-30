import type { Meta, StoryObj } from "@storybook/angular";
import { ContentsList } from "./ContentsList";

const meta: Meta<ContentsList> = {
  title: "Headless/ContentsList",
  component: ContentsList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContentsList>;

export const Default: Story = {};
