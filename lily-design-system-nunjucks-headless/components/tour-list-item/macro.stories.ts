import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="tour-list-item"></li>`;

const meta = {
  title: 'Headless/TourListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
