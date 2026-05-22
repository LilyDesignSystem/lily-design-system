import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<header class="section-heading">
  <p class="section-heading-eyebrow">
    <!-- Consumer provides eyebrow text (optional) -->
  </p>
  <h2 class="section-heading-heading">
    <!-- Consumer provides heading text. Consumer may swap <h2> for <h3>–<h6>. -->
  </h2>
  <p class="section-heading-subtitle">
    <!-- Consumer provides subtitle text (optional) -->
  </p>
</header>`;

const meta = {
  title: 'Headless/SectionHeading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
