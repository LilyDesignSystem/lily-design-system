import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<th
  class="table-th"
  scope="col"></th>`;

const meta = {
  title: 'Headless/TableTh',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
