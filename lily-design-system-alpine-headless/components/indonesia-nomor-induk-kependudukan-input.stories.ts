import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IndonesiaNomorIndukKependudukanInput component -->\n<!--\n  Description: an input for entering Indonesia's Nomor Induk Kependudukan (NIK)\n  HTML tag: <input>\n  CSS class: indonesia-nomor-induk-kependudukan-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Sixteen digits: region, date of birth (+40 to day for females), serial. No check digit.\n  Usage:\n    <input class=\"indonesia-nomor-induk-kependudukan-input\" type=\"text\" aria-label=\"Nomor Induk Kependudukan (NIK)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"indonesia-nomor-induk-kependudukan-input\"\n  type=\"text\"\n  aria-label=\"Nomor Induk Kependudukan (NIK)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Indonesia Nomor Induk Kependudukan Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
