import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupPhoneLandscape component -->\n<!--\n  Description: a box area that looks like a mobile phone in landscape orientation\n  HTML tag: <div>\n  CSS class: mockup-phone-landscape\n-->\n\n<div class=\"mockup-phone-landscape\" role=\"img\" aria-label=\"\">\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Phone Landscape',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
