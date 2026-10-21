import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- InputWithMask component -->\n<!--\n  Description: an input displaying a format mask placeholder for the user to fill in\n\n  HTML tag: <div>\n  CSS class: input-with-mask\n  Keyboard: Native <input type=\"text\"> keyboard behavior\n  Accessibility:\n    - The mask display span is decorative and uses aria-hidden=\"true\"\n    - The accessible name comes from a required aria-label on the inner <input>\n    - The mask string is also exposed via data-mask on the wrapper for consumer styling\n\n  Usage:\n    <div class=\"input-with-mask\" data-mask=\"(___) ___-____\">\n      <span class=\"input-with-mask-display\" aria-hidden=\"true\">(___) ___-____</span>\n      <input class=\"input-with-mask-control\"\n             type=\"text\"\n             aria-label=\"Phone number\"\n             value=\"\"\n             placeholder=\"\">\n    </div>\n-->\n\n<div\n  class=\"input-with-mask\"\n  data-mask=\"\"\n>\n  <span\n    class=\"input-with-mask-display\"\n    aria-hidden=\"true\"\n  >\n    <!-- Consumer renders the mask string here as a decorative overlay/placeholder -->\n  </span>\n  <input\n    class=\"input-with-mask-control\"\n    type=\"text\"\n    aria-label=\"\"\n    value=\"\"\n  >\n</div>";

const meta = {
  title: 'Headless/Input With Mask',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
