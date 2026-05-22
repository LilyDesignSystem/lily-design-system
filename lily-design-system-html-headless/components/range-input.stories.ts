import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="range-input"
  type="range"
  aria-label=""
>`;

const meta = {
  title: 'Headless/RangeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
