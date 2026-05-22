import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="clamp-text"
  data-lines="2"
  style="--clamp-text-lines: 2;"></div>`;

const meta = {
  title: 'Headless/ClampText',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
