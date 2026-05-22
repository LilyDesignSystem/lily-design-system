import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="byline">
  <span class="byline-authors"></span></div>`;

const meta = {
  title: 'Headless/Byline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
