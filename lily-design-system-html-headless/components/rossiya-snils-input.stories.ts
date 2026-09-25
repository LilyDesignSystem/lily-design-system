import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="rossiya-snils-input"
  type="text"
  aria-label="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/RossiyaSnilsInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
