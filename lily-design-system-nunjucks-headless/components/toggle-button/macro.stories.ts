import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="toggle-button"
  type="button"
  aria-pressed="false"></button>`;

const meta = {
  title: 'Headless/ToggleButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
