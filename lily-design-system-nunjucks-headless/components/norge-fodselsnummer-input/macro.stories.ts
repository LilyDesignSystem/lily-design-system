import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="norge-fodselsnummer-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Norwegian Birth Number">`;

const meta = {
  title: 'Headless/NorgeFodselsnummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
