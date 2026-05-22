import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="file-upload"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // FileUpload behavior
  (function() {
    'use strict';
    // FileUpload: consumer implements interactive behavior
    document.querySelectorAll('.file-upload').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/FileUpload',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
