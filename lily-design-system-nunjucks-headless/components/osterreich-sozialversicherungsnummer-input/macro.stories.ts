import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="osterreich-sozialversicherungsnummer-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Sozialversicherungsnummer (SVNR)">`;

const meta = {
  title: 'Headless/OsterreichSozialversicherungsnummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
