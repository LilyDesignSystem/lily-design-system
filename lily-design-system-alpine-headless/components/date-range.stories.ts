import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<fieldset class=\"date-range\" aria-label=\"Trip dates\">\n  <input class=\"date-input\" type=\"date\" aria-label=\"Departure\" />\n  <input class=\"date-input\" type=\"date\" aria-label=\"Return\" />\n</fieldset>";

const meta = {
  title: 'Headless/Date Range',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
