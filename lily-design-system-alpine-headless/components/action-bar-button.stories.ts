import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ActionBarButton component -->\n<!--\n  Description: one action button inside an action bar\n\n  HTML tag: <button>\n  CSS class: action-bar-button\n  Keyboard: Tab to focus, Enter or Space to activate (native <button> behavior)\n  Accessibility: aria-label is REQUIRED for accessible name; disabled state honored\n                 by the browser. Sits inside an action-bar (role=\"toolbar\").\n\n  Usage:\n    <button class=\"action-bar-button\" type=\"button\" aria-label=\"Delete\">\n      <svg>...</svg>\n    </button>\n-->\n\n<button\n  class=\"action-bar-button\"\n  type=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides icon and/or text content -->\n</button>";

const meta = {
  title: 'Headless/Action Bar Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
