import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableHead } from "./CalendarTableHead";

// Attribute-selector component (`thead[lily-calendar-table-head]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <thead> explicitly via `render`.
const meta: Meta<CalendarTableHead> = {
  title: "Headless/CalendarTableHead",
  component: CalendarTableHead,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CalendarTableHead] },
    template: `<thead lily-calendar-table-head [className]="className"></thead>`,
  }),
};

export default meta;
type Story = StoryObj<CalendarTableHead>;

export const Default: Story = {};
