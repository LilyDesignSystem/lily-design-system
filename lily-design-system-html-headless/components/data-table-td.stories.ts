import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<td
  class="data-table-td"
>
  <!-- Consumer provides cell content -->
</td>`;

const meta = {
  title: 'Headless/DataTableTd',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
