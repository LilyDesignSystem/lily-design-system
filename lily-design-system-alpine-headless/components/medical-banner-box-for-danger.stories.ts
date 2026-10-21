import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MedicalBannerBoxForDanger component -->\n<!--\n  Description: a medical record banner box for danger information e.g. reactions, warnings, alarms, etc.\n  HTML tag: <div>\n  CSS class: medical-banner-box-for-danger\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name, data-type=\"danger\"\n  Usage:\n    <div class=\"medical-banner-box-for-danger\" role=\"region\" aria-label=\"Allergies\" data-type=\"danger\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"medical-banner-box-for-danger\"\n  role=\"region\"\n  aria-label=\"\"\n  data-type=\"danger\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Medical Banner Box For Danger',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
