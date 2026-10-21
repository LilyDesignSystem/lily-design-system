import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CymruRhifYGwasanaethIechydGwladolView component -->\n<!--\n  Description: a read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)\n  HTML tag: <span>\n  CSS class: cymru-rhif-y-gwasanaeth-iechyd-gwladol-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man)\n  Usage:\n    <span class=\"cymru-rhif-y-gwasanaeth-iechyd-gwladol-view\" aria-label=\"National Health Service Number\">value-here</span>\n-->\n\n<span\n  class=\"cymru-rhif-y-gwasanaeth-iechyd-gwladol-view\"\n  aria-label=\"National Health Service Number\"\n></span>";

const meta = {
  title: 'Headless/Cymru Rhif YGwasanaeth Iechyd Gwladol View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
