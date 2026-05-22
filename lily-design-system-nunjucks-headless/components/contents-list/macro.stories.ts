import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="contents-list"></ol>`;

const meta = {
  title: 'Headless/ContentsList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
