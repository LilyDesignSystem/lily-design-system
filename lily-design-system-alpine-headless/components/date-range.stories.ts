import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DateRange component -->\n<!--\n  Description: paired start and end date inputs\n  HTML tag: <fieldset> containing two <input type=\"date\">\n  CSS class: date-range (fieldset), date-input (each input)\n  Keyboard: native date-input keys (Tab between the two, arrows within)\n  Accessibility: aria-label on the fieldset (group name) and on each input\n  Usage: replace the three aria-label values with consumer-supplied text\n-->\n\n<fieldset class=\"date-range\" aria-label=\"Trip dates\">\n  <input class=\"date-input\" type=\"date\" aria-label=\"Departure\" />\n  <input class=\"date-input\" type=\"date\" aria-label=\"Return\" />\n</fieldset>";

const meta = {
  title: 'Headless/Date Range',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
