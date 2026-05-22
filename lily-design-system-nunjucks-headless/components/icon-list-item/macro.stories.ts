import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="icon-list-item"><span class="icon-list-item-text"></span>
</li>`;

const meta = {
  title: 'Headless/IconListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
