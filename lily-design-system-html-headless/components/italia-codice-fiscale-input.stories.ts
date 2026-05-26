import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="italia-codice-fiscale-input"
  type="text"
  aria-label="Italian Fiscal Code"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/ItaliaCodiceFiscaleInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
