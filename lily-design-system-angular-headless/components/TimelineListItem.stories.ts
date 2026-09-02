import type { Meta, StoryObj } from "@storybook/angular";
import { TimelineListItem } from "./TimelineListItem";

// Attribute-selector component (`li[lily-timeline-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<TimelineListItem> = {
  title: "Headless/TimelineListItem",
  component: TimelineListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TimelineListItem] },
    template: `<li lily-timeline-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<TimelineListItem>;

export const Default: Story = {};
