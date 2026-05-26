import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="danmark-personnummer-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Personal Identity Code">`;

const meta = {
  title: 'Headless/DanmarkPersonnummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
