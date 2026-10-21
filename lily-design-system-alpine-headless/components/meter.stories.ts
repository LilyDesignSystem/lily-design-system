import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Meter component -->\n<!--\n  Description: a gauge displaying a scalar value within a known range\n  HTML tag: <meter>\n  CSS class: meter\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <meter class=\"meter\" aria-label=\"Example\">\n      ...\n    </meter>\n-->\n\n<meter\n  class=\"meter\"\n  aria-label=\"\"\n  min=\"0\"\n  max=\"100\"\n  value=\"0\"\n>\n  <!-- Consumer provides fallback text -->\n</meter>";

const meta = {
  title: 'Headless/Meter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
