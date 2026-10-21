import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IconButton component -->\n<!--\n  Description: a button containing only an icon with a required accessible label\n\n  HTML tag: <button>\n  CSS class: icon-button\n  Keyboard: Tab to focus, Enter or Space to activate (native <button> behavior)\n  Accessibility: aria-label is REQUIRED — provides the entire accessible name for an icon-only button. aria-pressed is set when the button is a toggle.\n\n  Behavior:\n    Renders a native <button type=\"button\"> with a required aria-label.\n    The icon (svg, glyph, emoji) is supplied by the consumer as inner content.\n    A small script enforces type=\"button\" by default and reads aria-pressed\n    to keep state consistent if the consumer toggles data-pressed.\n\n  Usage:\n    <button class=\"icon-button\" type=\"button\" aria-label=\"Close\" aria-pressed=\"false\">\n      <svg>...</svg>\n    </button>\n-->\n\n<button\n  class=\"icon-button\"\n  type=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->\n</button>";

const meta = {
  title: 'Headless/Icon Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
