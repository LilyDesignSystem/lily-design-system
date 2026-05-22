import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="info-state"
  role="status"
  data-level="info"
  aria-label=""
>
  <!-- Optional illustration slot -->
  <div class="info-state-illustration">
    <!-- Consumer provides illustration content (SVG, image, etc.) -->
  </div>

  <!-- Required title heading -->
  <h2 class="info-state-title">
    <!-- Consumer provides title text -->
  </h2>

  <!-- Optional description -->
  <p class="info-state-description">
    <!-- Consumer provides description text -->
  </p>

  <!-- Optional action area for call-to-action buttons -->
  <div class="info-state-action">
    <!-- Consumer provides action buttons -->
  </div>
</section>`;

const meta = {
  title: 'Headless/InfoState',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
