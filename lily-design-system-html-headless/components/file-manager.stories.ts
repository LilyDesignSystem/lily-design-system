import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="file-manager"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // FileManager behavior
  (function() {
    'use strict';
    // FileManager: consumer implements interactive behavior
    document.querySelectorAll('.file-manager').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/FileManager',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
