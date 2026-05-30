import type { Meta, StoryObj } from "@storybook/angular";
import { RelatedContent } from "./RelatedContent";

const meta: Meta<RelatedContent> = {
  title: "Headless/RelatedContent",
  component: RelatedContent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RelatedContent>;

export const Default: Story = {};
