import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="call-to-action"
  role="region"
  aria-label="Call to action"></div>`;

const meta = {
  title: 'Headless/CallToAction',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
