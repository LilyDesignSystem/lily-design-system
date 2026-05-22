import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="beach-ball"
  aria-hidden="true"></div>`;

const meta = {
  title: 'Headless/BeachBall',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
