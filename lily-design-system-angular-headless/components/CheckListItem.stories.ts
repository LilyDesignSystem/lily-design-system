import type { Meta, StoryObj } from "@storybook/angular";
import { CheckListItem } from "./CheckListItem";

// Attribute-selector component (`li[lily-check-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<CheckListItem> = {
  title: "Headless/CheckListItem",
  component: CheckListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CheckListItem] },
    template: `<li lily-check-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<CheckListItem>;

export const Default: Story = {};
