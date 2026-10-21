import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"indonesia-nomor-induk-kependudukan-input\"\n  type=\"text\"\n  aria-label=\"Nomor Induk Kependudukan (NIK)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Indonesia Nomor Induk Kependudukan Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
