import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MeasurementUnitInput component -->\n<!--\n  Description: an input for selecting a measurement unit\n  HTML tag: <div>\n  CSS class: measurement-unit-input\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"measurement-unit-input\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"measurement-unit-input\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Measurement Unit Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
