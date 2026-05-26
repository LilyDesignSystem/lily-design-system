import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="romania-cod-numeric-personal-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Personal Numerical Code">`;

const meta = {
  title: 'Headless/RomaniaCodNumericPersonalInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
