import type { Meta, StoryObj } from "@storybook/angular";
import { PaginationListItem } from "./PaginationListItem";

// Attribute-selector component (`li[lily-pagination-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<PaginationListItem> = {
  title: "Headless/PaginationListItem",
  component: PaginationListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [PaginationListItem] },
    template: `<li lily-pagination-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<PaginationListItem>;

export const Default: Story = {};
