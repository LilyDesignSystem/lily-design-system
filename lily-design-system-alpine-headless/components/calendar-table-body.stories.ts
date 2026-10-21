import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><tbody class=\"calendar-table-body\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tbody></table>";

const meta = {
  title: 'Headless/Calendar Table Body',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
