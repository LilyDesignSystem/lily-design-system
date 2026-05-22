import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="content-block"
  data-width="normal"></div>`;

const meta = {
  title: 'Headless/ContentBlock',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
