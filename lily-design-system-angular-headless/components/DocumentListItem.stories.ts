import type { Meta, StoryObj } from "@storybook/angular";
import { DocumentListItem } from "./DocumentListItem";

// Attribute-selector component (`li[lily-document-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<DocumentListItem> = {
  title: "Headless/DocumentListItem",
  component: DocumentListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DocumentListItem] },
    template: `<li lily-document-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<DocumentListItem>;

export const Default: Story = {};
