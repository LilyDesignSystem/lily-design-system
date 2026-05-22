import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="feature-card"
  data-image-position="start"><header class="feature-card-header">
    <h3 class="feature-card-heading"></h3>
  </header></article>`;

const meta = {
  title: 'Headless/FeatureCard',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
