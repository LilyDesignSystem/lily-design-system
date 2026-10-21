import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BharatAadhaarInput component -->\n<!--\n  Description: an input for entering India's Aadhaar (आधार)\n  HTML tag: <input>\n  CSS class: bharat-aadhaar-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).\n  Usage:\n    <input class=\"bharat-aadhaar-input\" type=\"text\" aria-label=\"Aadhaar (आधार)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"bharat-aadhaar-input\"\n  type=\"text\"\n  aria-label=\"Aadhaar (आधार)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Bharat Aadhaar Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
