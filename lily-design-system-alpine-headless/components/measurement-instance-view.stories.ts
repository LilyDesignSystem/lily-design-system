import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MeasurementInstanceView component -->\n<!--\n  Description: a read-only display of a measurement value and unit\n  HTML tag: <span>\n  CSS class: measurement-instance-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"measurement-instance-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"measurement-instance-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Measurement Instance View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
