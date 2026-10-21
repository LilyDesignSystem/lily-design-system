import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"headline\"\n  aria-label=\"\"\n>\n  <h1 class=\"headline-heading\">\n    <!-- Consumer provides heading text -->\n  </h1>\n  <div class=\"headline-subtitle\">\n    <!-- Consumer provides subtitle -->\n  </div>\n  <div class=\"headline-byline\">\n    <!-- Consumer provides byline -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Headline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
