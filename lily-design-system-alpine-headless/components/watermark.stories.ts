import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Watermark component -->\n<!--\n  Description: a decorative repeating overlay text or image marking a page\n\n  HTML tag: <div>\n  CSS class: watermark\n  Keyboard: None (purely decorative)\n  Accessibility:\n    - The overlay carries aria-hidden=\"true\" because the watermark is\n      decorative — its content must not be announced by screen readers.\n    - data-text and data-image-url on the overlay expose the watermark content\n      so consumer CSS can render the repeating pattern (e.g. via\n      background-image with an SVG-encoded text).\n    - data-rotate and data-gap on the wrapper expose layout hints for the\n      repeat pattern (rotation in degrees, spacing between repeats).\n\n  Behavior:\n    Renders a wrapper <div class=\"watermark\"> with two children:\n      - <div class=\"watermark-overlay\" aria-hidden=\"true\">  — the decorative\n        overlay layer; consumer applies the actual repeating-pattern CSS.\n      - the consumer-supplied content rendered beneath the overlay.\n    Purely passive: no script. The headless component just exposes the props\n    via data-* attributes and the right structural ARIA.\n\n  Usage:\n    <div class=\"watermark\" data-rotate=\"-22\" data-gap=\"100px\">\n      <div\n        class=\"watermark-overlay\"\n        aria-hidden=\"true\"\n        data-text=\"CONFIDENTIAL\"\n      ></div>\n      … Consumer-supplied content goes here, beneath the overlay. …\n    </div>\n-->\n\n<div\n  class=\"watermark\"\n  data-rotate=\"-22\"\n  data-gap=\"100px\"\n>\n  <!-- Decorative repeating overlay layer. aria-hidden so screen readers ignore it. -->\n  <div\n    class=\"watermark-overlay\"\n    aria-hidden=\"true\"\n    data-text=\"\"\n    data-image-url=\"\"\n  ></div>\n\n  <!-- Consumer provides the page content rendered beneath the watermark -->\n</div>";

const meta = {
  title: 'Headless/Watermark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
