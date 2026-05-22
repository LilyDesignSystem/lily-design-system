import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<th
  class="data-table-th"
  scope="col"></th>`;

const meta = {
  title: 'Headless/DataTableTh',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
