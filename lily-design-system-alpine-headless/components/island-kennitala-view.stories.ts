import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IslandKennitalaView component -->\n<!--\n  Description: a read-only display of Iceland's Kennitala\n  HTML tag: <span>\n  CSS class: island-kennitala-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits where the first 6 are the date of birth (DDMMYY)\n  Usage:\n    <span class=\"island-kennitala-view\" aria-label=\"Personal Identity Code\">value-here</span>\n-->\n\n<span\n  class=\"island-kennitala-view\"\n  aria-label=\"Personal Identity Code\"\n></span>";

const meta = {
  title: 'Headless/Island Kennitala View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
