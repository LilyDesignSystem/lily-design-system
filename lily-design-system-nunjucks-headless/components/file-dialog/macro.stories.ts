import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="file-dialog"
  role="dialog" aria-modal="true"
  aria-label="Select a file" hidden></div>`;

const meta = {
  title: 'Headless/FileDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
