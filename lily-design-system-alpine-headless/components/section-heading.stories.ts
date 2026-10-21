import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<header class=\"section-heading\">\n  <p class=\"section-heading-eyebrow\">\n    <!-- Consumer provides eyebrow text (optional) -->\n  </p>\n  <h2 class=\"section-heading-heading\">\n    <!-- Consumer provides heading text. Consumer may swap <h2> for <h3>–<h6>. -->\n  </h2>\n  <p class=\"section-heading-subtitle\">\n    <!-- Consumer provides subtitle text (optional) -->\n  </p>\n</header>";

const meta = {
  title: 'Headless/Section Heading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
