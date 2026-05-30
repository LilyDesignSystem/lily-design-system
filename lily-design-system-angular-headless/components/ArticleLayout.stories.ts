import type { Meta, StoryObj } from "@storybook/angular";
import { ArticleLayout } from "./ArticleLayout";

const meta: Meta<ArticleLayout> = {
  title: "Headless/ArticleLayout",
  component: ArticleLayout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ArticleLayout>;

export const Default: Story = {};
