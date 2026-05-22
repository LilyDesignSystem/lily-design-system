import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="collection-list-item"></li>`;

const meta = {
  title: 'Headless/CollectionListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
