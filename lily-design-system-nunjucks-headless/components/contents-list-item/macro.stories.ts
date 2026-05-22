import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="contents-list-item"></li>`;

const meta = {
  title: 'Headless/ContentsListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
