import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SliderButton component -->\n<!--\n  Description: a button with a slider\n  HTML tag: <button>\n  CSS class: slider-button\n  Keyboard: Tab to focus, Enter/Space to activate\n  Accessibility: role=\"slider\", aria-label for accessible name\n-->\n\n<button\n  class=\"slider-button\"\n  role=\"slider\"\n  aria-label=\"\"\n  type=\"button\"\n  aria-valuemin=\"0\"\n  aria-valuemax=\"100\"\n  aria-valuenow=\"0\"\n>\n  <!-- Consumer provides content -->\n</button>";

const meta = {
  title: 'Headless/Slider Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
