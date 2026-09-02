import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableTD } from "./CalendarTableTD";

// Attribute-selector component (`td[lily-calendar-table-td]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <td> explicitly via `render`.
const meta: Meta<CalendarTableTD> = {
  title: "Headless/CalendarTableTD",
  component: CalendarTableTD,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CalendarTableTD] },
    template: `<td lily-calendar-table-td [className]="className"></td>`,
  }),
};

export default meta;
type Story = StoryObj<CalendarTableTD>;

export const Default: Story = {};
