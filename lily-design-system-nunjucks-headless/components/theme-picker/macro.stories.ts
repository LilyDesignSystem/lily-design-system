import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="theme-select"
  role="radiogroup" aria-label="Theme"></div>`;

const meta = {
  title: 'Headless/ThemeSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
