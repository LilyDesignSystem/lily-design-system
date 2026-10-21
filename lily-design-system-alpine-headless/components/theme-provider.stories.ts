import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ThemeProvider component -->\n<!--\n  Description: a container applying theme CSS custom properties\n  HTML tag: <div>\n  CSS class: theme-provider\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"theme-provider\"\n  aria-label=\"\"\n  data-theme=\"light\"\n  style=\"display: contents;\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Theme Provider',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
