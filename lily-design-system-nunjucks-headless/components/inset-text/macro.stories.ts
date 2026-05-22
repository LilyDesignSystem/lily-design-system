import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="inset-text"></div>`;

const meta = {
  title: 'Headless/InsetText',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
