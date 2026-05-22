import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="body-text"></div>`;

const meta = {
  title: 'Headless/BodyText',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
