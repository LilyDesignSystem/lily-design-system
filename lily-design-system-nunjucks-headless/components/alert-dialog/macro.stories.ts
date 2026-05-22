import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dialog
  class="alert-dialog"
  role="alertdialog"></dialog>`;

const meta = {
  title: 'Headless/AlertDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
