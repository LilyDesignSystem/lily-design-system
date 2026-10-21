import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MedicalBannerBox component -->\n<!--\n  Description: a medical banner box inside a medical banner, using flexbox horizontal\n  HTML tag: <div>\n  CSS class: medical-banner-box\n  Keyboard: None (passive element)\n  Accessibility: data-context=\"medical\", optional aria-label\n  Usage:\n    <div class=\"medical-banner\" role=\"region\" aria-live=\"polite\" aria-label=\"Patient summary\" data-context=\"medical\">\n      <div class=\"medical-banner-box\" data-context=\"medical\">\n        <span>Patient: John Smith</span>\n        <span>NHS: 123 456 7890</span>\n      </div>\n    </div>\n-->\n\n<div\n  class=\"medical-banner-box\"\n  data-context=\"medical\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Medical Banner Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
