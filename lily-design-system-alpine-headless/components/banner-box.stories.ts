import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BannerBox component -->\n<!--\n  Description: a banner box that is inside a banner component, using flexbox horizontal\n\n  Attributes:\n    class — CSS class name(s) provided by consumer\n    aria-label — optional accessible name\n\n  Usage:\n    <div class=\"banner\" role=\"banner\" aria-label=\"Announcement\">\n      <div class=\"banner-box\">\n        <span>Message text</span>\n        <button>Action</button>\n      </div>\n    </div>\n\n  Notes:\n    - Consumer applies flexbox styles: display: flex; flex-direction: row;\n    - Intended to be placed inside a Banner component\n-->\n\n<div\n  class=\"banner-box\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Banner Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
