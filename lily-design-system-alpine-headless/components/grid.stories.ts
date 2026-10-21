import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Grid component -->\n<!--\n  Description: a CSS grid layout container with configurable columns and gap\n\n  HTML tag: <div>\n  CSS class: grid\n  Keyboard: None (passive element)\n  Accessibility: None — purely structural layout container\n\n  Behavior:\n    Inline style applies display: grid with grid-template-columns and gap.\n    By default uses repeat(12, minmax(0, 1fr)) for a 12-column grid.\n    Consumers may set data-columns to a number (12) or a custom string\n    (e.g. \"1fr 2fr 1fr\") which is then used as-is.\n\n  Usage:\n    <div class=\"grid\" data-columns=\"12\"\n         style=\"display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem;\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"grid\"\n  data-columns=\"12\"\n  style=\"display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem;\"\n>\n  <!-- Consumer provides grid items -->\n</div>";

const meta = {
  title: 'Headless/Grid',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
