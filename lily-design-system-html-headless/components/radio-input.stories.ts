import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="radio-input"
  type="radio"
  aria-label=""
>`;

const meta = {
  title: 'Headless/RadioInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
