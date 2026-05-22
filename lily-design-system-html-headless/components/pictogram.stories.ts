import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="pictogram"
  data-layout="centered"
  aria-label=""
>
  <div class="pictogram-icon" aria-hidden="true">
    <!-- Consumer provides icon content (SVG, emoji, illustration) -->
  </div>
  <figcaption class="pictogram-caption">
    <h3 class="pictogram-heading">
      <!-- Consumer provides heading text (optional) -->
    </h3>
    <p class="pictogram-description">
      <!-- Consumer provides description text (optional) -->
    </p>
  </figcaption>
</figure>`;

const meta = {
  title: 'Headless/Pictogram',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
