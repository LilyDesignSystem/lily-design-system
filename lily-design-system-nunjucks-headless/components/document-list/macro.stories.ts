import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="document-list"></ul>`;

const meta = {
  title: 'Headless/DocumentList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
