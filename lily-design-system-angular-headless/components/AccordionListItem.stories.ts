import type { Meta, StoryObj } from "@storybook/angular";
import { AccordionListItem } from "./AccordionListItem";

// Attribute-selector component (`li[lily-accordion-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<AccordionListItem> = {
  title: "Headless/AccordionListItem",
  component: AccordionListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [AccordionListItem] },
    template: `<li lily-accordion-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<AccordionListItem>;

export const Default: Story = {};
