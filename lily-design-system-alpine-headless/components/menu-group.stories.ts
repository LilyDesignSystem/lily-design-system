import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MenuGroup component -->\n<!--\n  Description: a labeled section of menu items within a menu\n\n  HTML tag: <div> with role=\"group\"\n  CSS class: menu-group\n  Keyboard: None directly; menu-item children handle navigation in the parent menu.\n  Accessibility: role=\"group\" with required aria-label; the visible heading is\n                 marked aria-hidden=\"true\" since aria-label already conveys it\n                 to assistive technology.\n\n  Usage:\n    <div class=\"menu-group\" role=\"group\" aria-label=\"File\">\n      <div class=\"menu-group-heading\" aria-hidden=\"true\">File</div>\n      … consumer inserts menu-item children here …\n    </div>\n-->\n\n<div\n  class=\"menu-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <div class=\"menu-group-heading\" aria-hidden=\"true\"></div>\n  <!-- Consumer inserts menu-item children here -->\n</div>";

const meta = {
  title: 'Headless/Menu Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
