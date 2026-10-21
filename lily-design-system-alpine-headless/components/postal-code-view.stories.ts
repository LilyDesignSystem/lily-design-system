import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PostalCodeView component -->\n<!--\n  Description: a read-only display of a postal or ZIP code\n  HTML tag: <span>\n  CSS class: postal-code-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"postal-code-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"postal-code-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Postal Code View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
