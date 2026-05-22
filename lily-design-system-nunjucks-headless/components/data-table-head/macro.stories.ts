import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<thead
  class="data-table-head"></thead>`;

const meta = {
  title: 'Headless/DataTableHead',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
