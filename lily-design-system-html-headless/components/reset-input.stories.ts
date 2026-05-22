import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="reset-input"
  type="reset"
  aria-label=""
>`;

const meta = {
  title: 'Headless/ResetInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
