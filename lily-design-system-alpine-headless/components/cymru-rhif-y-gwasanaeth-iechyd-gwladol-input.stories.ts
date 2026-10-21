import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CymruRhifYGwasanaethIechydGwladolInput component -->\n<!--\n  Description: an input for entering Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)\n  HTML tag: <input>\n  CSS class: cymru-rhif-y-gwasanaeth-iechyd-gwladol-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man)\n  Usage:\n    <input class=\"cymru-rhif-y-gwasanaeth-iechyd-gwladol-input\" type=\"text\" aria-label=\"National Health Service Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"cymru-rhif-y-gwasanaeth-iechyd-gwladol-input\"\n  type=\"text\"\n  aria-label=\"National Health Service Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Cymru Rhif YGwasanaeth Iechyd Gwladol Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
