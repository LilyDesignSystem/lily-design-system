import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="tour-list"></ol>`;

const meta = {
  title: 'Headless/TourList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
