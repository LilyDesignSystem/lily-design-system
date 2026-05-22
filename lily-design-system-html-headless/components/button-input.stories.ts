import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="button-input"
  type="button"
  aria-label=""
>`;

const meta = {
  title: 'Headless/ButtonInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
