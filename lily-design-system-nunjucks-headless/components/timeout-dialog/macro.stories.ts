import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dialog
  class="timeout-dialog"></dialog>`;

const meta = {
  title: 'Headless/TimeoutDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
