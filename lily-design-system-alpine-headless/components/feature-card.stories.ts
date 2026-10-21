import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FeatureCard component -->\n<!--\n  Description: a large content card with a prominent image positioned alongside or above the text\n  HTML tag: <article>\n  CSS class: feature-card\n  Keyboard: None (passive container; interactive children manage their own focus)\n  Accessibility:\n    - <article> landmark with aria-label (consumer-provided, defaults to heading text)\n    - data-image-position exposes layout intent (\"start\" | \"end\" | \"top\") for styling\n    - <header> wraps the heading; <h3> by default for the card heading\n    - decorative image uses alt text supplied by the consumer (empty string if purely decorative)\n  Usage:\n    <article\n      class=\"feature-card\"\n      data-image-position=\"start\"\n      aria-label=\"Feature heading\"\n    >\n      <img class=\"feature-card-image\" src=\"/img/feature.jpg\" alt=\"\">\n      <header class=\"feature-card-header\">\n        <h3 class=\"feature-card-heading\">Feature heading</h3>\n      </header>\n      <p class=\"feature-card-description\">Body text describing the feature.</p>\n      … Optional CTAs or other children go here …\n    </article>\n-->\n\n<article\n  class=\"feature-card\"\n  data-image-position=\"start\"\n  aria-label=\"\"\n>\n  <img class=\"feature-card-image\" src=\"\" alt=\"\">\n  <header class=\"feature-card-header\">\n    <h3 class=\"feature-card-heading\">\n      <!-- Consumer provides heading text -->\n    </h3>\n  </header>\n  <p class=\"feature-card-description\">\n    <!-- Consumer provides description text (optional) -->\n  </p>\n  <!-- Consumer provides additional content (e.g., CTAs) -->\n</article>";

const meta = {
  title: 'Headless/Feature Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
