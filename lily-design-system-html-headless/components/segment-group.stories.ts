import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="segment-group"
  role="group"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // SegmentGroup behavior
  (function() {
    'use strict';
    // SegmentGroup: consumer implements interactive behavior
    document.querySelectorAll('.segment-group').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/SegmentGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
