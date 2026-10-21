import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DateTimeView component -->\n<!--\n  Description: a read-only display of a formatted date and time\n\n  HTML tag: <time>\n  CSS class: date-time-view\n  Keyboard: None (passive element)\n  Accessibility: implicit <time> semantics; the datetime attribute provides a machine-readable ISO 8601 value; aria-label optional for an override\n\n  Behavior:\n    Renders a semantic <time> element with the datetime attribute set to the\n    consumer-supplied ISO 8601 string. Display text is consumer-supplied\n    (component performs no formatting or localization).\n\n  Usage:\n    <time class=\"date-time-view\" datetime=\"2026-04-27T09:00:00Z\" aria-label=\"April 27, 2026\">\n      27 April 2026, 09:00\n    </time>\n-->\n\n<time\n  class=\"date-time-view\"\n  datetime=\"\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides display text (already formatted/localized) -->\n</time>";

const meta = {
  title: 'Headless/Date Time View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
