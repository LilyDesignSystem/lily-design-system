import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="feature-photo"
  aria-label=""
>
  <img class="feature-photo-image" src="" alt="" loading="lazy">
  <figcaption class="feature-photo-caption">
    <!-- Consumer provides caption + credit -->
  </figcaption>
</figure>`;

const meta = {
  title: 'Headless/FeaturePhoto',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
