import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AngleSliderRangeInput component -->\n<!--\n  Description: a range input for selecting an angle in degrees\n  HTML tag: <input>\n  CSS class: angle-slider-range-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"angle-slider-range-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"angle-slider-range-input\"\n  type=\"range\"\n  aria-label=\"\"\n  min=\"0\"\n  max=\"360\"\n  step=\"1\"\n>";

const meta = {
  title: 'Headless/Angle Slider Range Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
