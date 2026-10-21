import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ColorPickerButton component -->\n<!--\n  Description: a button showing a color swatch in a color picker\n  HTML tag: <button>\n  CSS class: color-picker-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: role=\"radio\", Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"color-picker-button\" role=\"radio\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"color-picker-button\"\n  role=\"radio\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Color Picker Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
