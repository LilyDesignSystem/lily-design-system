import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="editable"
  contenteditable="false"
  data-module="editable"
  role="textbox"
  aria-multiline="false"  tabindex="0"></span>`;

const meta = {
  title: 'Headless/Editable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
