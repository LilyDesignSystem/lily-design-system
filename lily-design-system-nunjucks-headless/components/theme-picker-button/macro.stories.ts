import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="theme-select-button"
  type="button"
  role="radio"
  aria-checked="false"
  tabindex="-1"
  data-theme=""></button>`;

const meta = {
  title: 'Headless/ThemeSelectButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
