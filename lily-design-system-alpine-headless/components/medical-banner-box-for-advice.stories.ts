import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MedicalBannerBoxForAdvice component -->\n<!--\n  Description: a medical record banner box for advice information e.g. contacts, contexts, plans, etc.\n  HTML tag: <div>\n  CSS class: medical-banner-box-for-advice\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name, data-type=\"advice\"\n  Usage:\n    <div class=\"medical-banner-box-for-advice\" role=\"region\" aria-label=\"Care contacts\" data-type=\"advice\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"medical-banner-box-for-advice\"\n  role=\"region\"\n  aria-label=\"\"\n  data-type=\"advice\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Medical Banner Box For Advice',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
