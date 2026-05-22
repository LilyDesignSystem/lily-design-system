import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="share-page"></div>`;

const meta = {
  title: 'Headless/SharePage',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
