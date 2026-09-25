import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="indonesia-nomor-induk-kependudukan-view"
  aria-label="Nomor Induk Kependudukan (NIK)">sample-value</span>`;

const meta = {
  title: 'Headless/IndonesiaNomorIndukKependudukanView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
