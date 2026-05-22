import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="theme-view"
  data-theme=""></span>`;

const meta = {
  title: 'Headless/ThemeView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
