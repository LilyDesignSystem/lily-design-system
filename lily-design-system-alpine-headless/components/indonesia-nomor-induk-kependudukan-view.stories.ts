import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IndonesiaNomorIndukKependudukanView component -->\n<!--\n  Description: a read-only display of Indonesia's Nomor Induk Kependudukan (NIK)\n  HTML tag: <span>\n  CSS class: indonesia-nomor-induk-kependudukan-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Sixteen digits: region, date of birth (+40 to day for females), serial. No check digit.\n  Usage:\n    <span class=\"indonesia-nomor-induk-kependudukan-view\" aria-label=\"Nomor Induk Kependudukan (NIK)\">value-here</span>\n-->\n\n<span\n  class=\"indonesia-nomor-induk-kependudukan-view\"\n  aria-label=\"Nomor Induk Kependudukan (NIK)\"\n></span>";

const meta = {
  title: 'Headless/Indonesia Nomor Induk Kependudukan View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
