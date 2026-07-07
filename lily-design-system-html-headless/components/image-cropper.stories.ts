import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="image-cropper"
  role="application"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ImageCropper behavior
  (function() {
    'use strict';
    // ImageCropper: consumer implements interactive behavior
    document.querySelectorAll('.image-cropper').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ImageCropper',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
