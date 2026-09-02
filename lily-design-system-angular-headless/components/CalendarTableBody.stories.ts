import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableBody } from "./CalendarTableBody";

// Attribute-selector component (`tbody[lily-calendar-table-body]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tbody> explicitly via `render`.
const meta: Meta<CalendarTableBody> = {
  title: "Headless/CalendarTableBody",
  component: CalendarTableBody,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CalendarTableBody] },
    template: `<tbody lily-calendar-table-body [className]="className"></tbody>`,
  }),
};

export default meta;
type Story = StoryObj<CalendarTableBody>;

export const Default: Story = {};
