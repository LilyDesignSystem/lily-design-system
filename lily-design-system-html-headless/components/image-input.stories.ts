import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="image-input"
  type="image"
  aria-label=""
>`;

const meta = {
  title: 'Headless/ImageInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
