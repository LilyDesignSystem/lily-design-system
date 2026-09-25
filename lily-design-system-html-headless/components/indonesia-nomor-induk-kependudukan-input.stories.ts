import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="indonesia-nomor-induk-kependudukan-input"
  type="text"
  aria-label="Nomor Induk Kependudukan (NIK)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/IndonesiaNomorIndukKependudukanInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
