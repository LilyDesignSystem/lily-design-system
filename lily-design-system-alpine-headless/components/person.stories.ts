import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Person component -->\n<!--\n  Description: a person component\n  HTML tag: <article>\n  CSS class: person\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<article\n  class=\"person\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Person',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
