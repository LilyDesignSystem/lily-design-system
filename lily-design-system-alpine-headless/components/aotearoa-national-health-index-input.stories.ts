import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AotearoaNationalHealthIndexInput component -->\n<!--\n  Description: an input for entering New Zealand's National Health Index (NHI) Number\n  HTML tag: <input>\n  CSS class: aotearoa-national-health-index-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.\n  Usage:\n    <input class=\"aotearoa-national-health-index-input\" type=\"text\" aria-label=\"National Health Index (NHI) Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"aotearoa-national-health-index-input\"\n  type=\"text\"\n  aria-label=\"National Health Index (NHI) Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Aotearoa National Health Index Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
