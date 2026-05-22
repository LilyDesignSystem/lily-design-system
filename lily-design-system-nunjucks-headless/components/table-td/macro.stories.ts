import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<td
  class="table-td"></td>`;

const meta = {
  title: 'Headless/TableTd',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
