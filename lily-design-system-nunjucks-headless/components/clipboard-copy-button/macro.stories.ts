import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="clipboard-copy-button"
  type="button"
  data-module="clipboard-copy-button">Copy</button>`;

const meta = {
  title: 'Headless/ClipboardCopyButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
