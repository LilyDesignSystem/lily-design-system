import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableFoot } from "./CalendarTableFoot";

// Attribute-selector component (`tfoot[lily-calendar-table-foot]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tfoot> explicitly via `render`.
const meta: Meta<CalendarTableFoot> = {
  title: "Headless/CalendarTableFoot",
  component: CalendarTableFoot,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CalendarTableFoot] },
    template: `<tfoot lily-calendar-table-foot [className]="className"></tfoot>`,
  }),
};

export default meta;
type Story = StoryObj<CalendarTableFoot>;

export const Default: Story = {};
