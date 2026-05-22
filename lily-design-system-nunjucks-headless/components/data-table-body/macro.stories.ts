import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tbody
  class="data-table-body"></tbody>`;

const meta = {
  title: 'Headless/DataTableBody',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
