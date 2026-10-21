import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"carousel\" role=\"region\" aria-roledescription=\"carousel\" aria-label=\"\" x-data=\"lilyCarousel(0)\" x-bind=\"root\">\n  <button class=\"carousel-previous\" aria-label=\"\" x-bind=\"previous\"><!-- Consumer provides icon --></button>\n  <div class=\"carousel-slides\">\n    <div class=\"carousel-slide\" x-bind=\"slide(0)\"><!-- Consumer provides slide content --></div>\n    <div class=\"carousel-slide\" x-bind=\"slide(1)\"><!-- Consumer provides slide content --></div>\n    <div class=\"carousel-slide\" x-bind=\"slide(2)\"><!-- Consumer provides slide content --></div>\n  </div>\n  <button class=\"carousel-next\" aria-label=\"\" x-bind=\"next\"><!-- Consumer provides icon --></button>\n</div>";

const meta = {
  title: 'Headless/Carousel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
