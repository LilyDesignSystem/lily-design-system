import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tfoot
  class="table-foot"></tfoot>`;

const meta = {
  title: 'Headless/TableFoot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
