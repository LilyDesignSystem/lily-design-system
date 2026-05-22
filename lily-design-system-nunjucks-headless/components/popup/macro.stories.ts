import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="popup"
  role="dialog"
  aria-label="Popup" hidden></div>`;

const meta = {
  title: 'Headless/Popup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
