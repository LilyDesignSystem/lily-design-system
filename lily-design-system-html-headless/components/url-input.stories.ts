import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="url-input"
  type="url"
  aria-label=""
>`;

const meta = {
  title: 'Headless/UrlInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
