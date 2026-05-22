import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="headline">
  <h1 class="headline-heading"></h1></div>`;

const meta = {
  title: 'Headless/Headline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
