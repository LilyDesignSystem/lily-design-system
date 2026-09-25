import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="schweiz-ahv-nummer-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Switzerland's AHV-Nummer / Numéro AVS">`;

const meta = {
  title: 'Headless/SchweizAhvNummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
