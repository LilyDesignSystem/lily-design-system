import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<time\n  class=\"date-time-view\"\n  datetime=\"\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides display text (already formatted/localized) -->\n</time>";

const meta = {
  title: 'Headless/Date Time View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
