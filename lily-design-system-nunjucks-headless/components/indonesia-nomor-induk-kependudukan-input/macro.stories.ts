import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="indonesia-nomor-induk-kependudukan-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Nomor Induk Kependudukan (NIK)">`;

const meta = {
  title: 'Headless/IndonesiaNomorIndukKependudukanInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
