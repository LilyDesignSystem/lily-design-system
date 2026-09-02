import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableRow } from "./CalendarTableRow";

// Attribute-selector component (`tr[lily-calendar-table-row]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tr> explicitly via `render`.
const meta: Meta<CalendarTableRow> = {
  title: "Headless/CalendarTableRow",
  component: CalendarTableRow,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CalendarTableRow] },
    template: `<tr lily-calendar-table-row [className]="className"></tr>`,
  }),
};

export default meta;
type Story = StoryObj<CalendarTableRow>;

export const Default: Story = {};
