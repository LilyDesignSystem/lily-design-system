import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="switch-button"
  type="button"
  role="switch"
  aria-checked="false"></button>`;

const meta = {
  title: 'Headless/SwitchButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
