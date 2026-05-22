import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="action-bar-button"
  type="button"></button>`;

const meta = {
  title: 'Headless/ActionBarButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
