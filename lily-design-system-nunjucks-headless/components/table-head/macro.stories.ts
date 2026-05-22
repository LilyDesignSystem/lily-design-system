import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<thead
  class="table-head"></thead>`;

const meta = {
  title: 'Headless/TableHead',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
