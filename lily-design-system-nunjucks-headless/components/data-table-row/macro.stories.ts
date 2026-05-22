import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tr
  class="data-table-row"></tr>`;

const meta = {
  title: 'Headless/DataTableRow',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
