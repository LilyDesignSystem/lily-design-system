import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SuperBanner component -->\n<!--\n  Description: a super-banner\n  HTML tag: <div>\n  CSS class: super-banner\n  Keyboard: None (passive element)\n  Accessibility: role=\"alert\", aria-label for accessible name\n-->\n\n<div\n  class=\"super-banner\"\n  role=\"alert\"\n  aria-label=\"\"\n  aria-live=\"assertive\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Super Banner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
