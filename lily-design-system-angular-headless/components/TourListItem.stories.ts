import type { Meta, StoryObj } from "@storybook/angular";
import { TourListItem } from "./TourListItem";

// Attribute-selector component (`li[lily-tour-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<TourListItem> = {
  title: "Headless/TourListItem",
  component: TourListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TourListItem] },
    template: `<li lily-tour-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<TourListItem>;

export const Default: Story = {};
