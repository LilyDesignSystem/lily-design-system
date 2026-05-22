import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="masonry"
  data-columns="3"
  style="column-count: 3; column-gap: 1rem;"></div>`;

const meta = {
  title: 'Headless/Masonry',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
