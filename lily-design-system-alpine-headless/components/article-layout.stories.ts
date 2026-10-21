import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ArticleLayout component -->\n<!--\n  Description: a top-level article wrapper\n  HTML tag: <article>\n  CSS class: article-layout\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<article\n  class=\"article-layout\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Article Layout',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
