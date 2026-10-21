import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RedAmberGreenPickerButton component -->\n<!--\n  Description: a picker button for selecting a red/amber/green status\n  HTML tag: <button>\n  CSS class: red-amber-green-picker-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: role=\"radio\", Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"red-amber-green-picker-button\" role=\"radio\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"red-amber-green-picker-button\"\n  role=\"radio\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Red Amber Green Picker Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
