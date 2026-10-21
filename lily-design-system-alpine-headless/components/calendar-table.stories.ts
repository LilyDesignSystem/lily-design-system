import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table\n  class=\"calendar-table\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides thead, tbody, tfoot -->\n</table>";

const meta = {
  title: 'Headless/Calendar Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
