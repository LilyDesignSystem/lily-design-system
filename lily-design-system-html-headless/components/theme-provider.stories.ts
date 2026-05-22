import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="theme-provider"
  aria-label=""
  data-theme="light"
  style="display: contents;"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/ThemeProvider',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
