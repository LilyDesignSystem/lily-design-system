import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="postal-code-input"
  type="text"
  aria-label=""
>`;

const meta = {
  title: 'Headless/PostalCodeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
