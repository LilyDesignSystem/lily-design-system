import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="popconfirm-dialog"
  role="alertdialog"
  aria-modal="false"
  id="popconfirm-dialog"
  aria-labelledby="popconfirm-dialog-title" hidden>
  <h2 class="popconfirm-dialog-title" id="popconfirm-dialog-title"></h2>  <button class="popconfirm-dialog-cancel" type="button"></button>
  <button class="popconfirm-dialog-confirm" type="button"></button>
</div>`;

const meta = {
  title: 'Headless/PopconfirmDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
