import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MeasurementSystemView component -->\n<!--\n  Description: a read-only display of a measurement system\n  HTML tag: <span>\n  CSS class: measurement-system-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"measurement-system-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"measurement-system-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Measurement System View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
