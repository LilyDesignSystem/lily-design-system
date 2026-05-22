import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="editable-form"
  action="#"
  method="post"></form>`;

const meta = {
  title: 'Headless/EditableForm',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
