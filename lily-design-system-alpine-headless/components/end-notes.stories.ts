import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EndNotes component -->\n<!--\n  Description: a section of titled endnote items\n  HTML tag: <section>\n  CSS class: end-notes\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<section\n  class=\"end-notes\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</section>";

const meta = {
  title: 'Headless/End Notes',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
