import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableTH } from "./CalendarTableTH";

// Attribute-selector component (`th[lily-calendar-table-th]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <th> explicitly via `render`.
const meta: Meta<CalendarTableTH> = {
  title: "Headless/CalendarTableTH",
  component: CalendarTableTH,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CalendarTableTH] },
    template: `<th lily-calendar-table-th [className]="className" [scope]="scope"></th>`,
  }),
};

export default meta;
type Story = StoryObj<CalendarTableTH>;

export const Default: Story = {};
