import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="tag-group"
  role="list"></ul>`;

const meta = {
  title: 'Headless/TagGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
