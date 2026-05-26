import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="norge-fodselsnummer-input"
  type="text"
  aria-label="Norwegian Birth Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/NorgeFodselsnummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
