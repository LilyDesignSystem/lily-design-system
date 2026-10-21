import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EestiIsikukoodView component -->\n<!--\n  Description: a read-only display of Estonia's Isikukood (IK)\n  HTML tag: <span>\n  CSS class: eesti-isikukood-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum\n  Usage:\n    <span class=\"eesti-isikukood-view\" aria-label=\"Personal Identification Code\">value-here</span>\n-->\n\n<span\n  class=\"eesti-isikukood-view\"\n  aria-label=\"Personal Identification Code\"\n></span>";

const meta = {
  title: 'Headless/Eesti Isikukood View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
