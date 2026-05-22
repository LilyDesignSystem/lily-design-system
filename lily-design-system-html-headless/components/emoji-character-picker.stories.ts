import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="emoji-character-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // EmojiCharacterPicker behavior
  (function() {
    'use strict';
    // EmojiCharacterPicker: consumer implements interactive behavior
    document.querySelectorAll('.emoji-character-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/EmojiCharacterPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
