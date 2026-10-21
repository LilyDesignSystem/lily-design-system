import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BharatAadhaarView component -->\n<!--\n  Description: a read-only display of India's Aadhaar (आधार)\n  HTML tag: <span>\n  CSS class: bharat-aadhaar-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).\n  Usage:\n    <span class=\"bharat-aadhaar-view\" aria-label=\"Aadhaar (आधार)\">value-here</span>\n-->\n\n<span\n  class=\"bharat-aadhaar-view\"\n  aria-label=\"Aadhaar (आधार)\"\n></span>";

const meta = {
  title: 'Headless/Bharat Aadhaar View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
