import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TimerButton component -->\n<!--\n  Description: a button with a timer\n  HTML tag: <button>\n  CSS class: timer-button\n  Keyboard: Tab to focus, Enter/Space to activate\n  Accessibility: aria-label for accessible name\n-->\n\n<button\n  class=\"timer-button\"\n  aria-label=\"\"\n  type=\"button\"\n  data-remaining-seconds=\"\"\n>\n  <!-- Consumer provides content -->\n</button>";

const meta = {
  title: 'Headless/Timer Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
