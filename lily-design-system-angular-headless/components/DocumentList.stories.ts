import type { Meta, StoryObj } from "@storybook/angular";
import { DocumentList } from "./DocumentList";

const meta: Meta<DocumentList> = {
  title: "Headless/DocumentList",
  component: DocumentList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DocumentList>;

export const Default: Story = {};
