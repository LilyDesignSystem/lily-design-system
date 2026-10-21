import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EestiIsikukoodInput component -->\n<!--\n  Description: an input for entering Estonia's Isikukood (IK)\n  HTML tag: <input>\n  CSS class: eesti-isikukood-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum\n  Usage:\n    <input class=\"eesti-isikukood-input\" type=\"text\" aria-label=\"Personal Identification Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"eesti-isikukood-input\"\n  type=\"text\"\n  aria-label=\"Personal Identification Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Eesti Isikukood Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
