import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="osterreich-sozialversicherungsnummer-input"
  type="text"
  aria-label="Sozialversicherungsnummer (SVNR)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/OsterreichSozialversicherungsnummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
