import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="data-table"
  aria-label=""
>
  <!-- Consumer provides thead, tbody, tfoot -->
</table>`;

const meta = {
  title: 'Headless/DataTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
