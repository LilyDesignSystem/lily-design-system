import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tag-input"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // TagInput behavior
  (function() {
    'use strict';
    // TagInput: consumer implements interactive behavior
    document.querySelectorAll('.tag-input').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TagInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
