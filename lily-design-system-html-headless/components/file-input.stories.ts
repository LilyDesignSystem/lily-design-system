import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="file-input"
  type="file"
  aria-label=""
>`;

const meta = {
  title: 'Headless/FileInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
