import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="organization"
  role="group"
  aria-label=""></div>`;

const meta = {
  title: 'Headless/Organization',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
