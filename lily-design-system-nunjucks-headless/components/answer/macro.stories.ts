import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="answer"
></div>`;

const meta = {
  title: 'Headless/Answer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
