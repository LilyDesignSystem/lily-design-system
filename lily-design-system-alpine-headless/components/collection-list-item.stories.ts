import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<li\n  class=\"collection-list-item\"\n  aria-label=\"\"\n>\n  <!-- Optional image:\n       <img class=\"collection-list-item-image\" src=\"\" alt=\"\"> -->\n\n  <h3 class=\"collection-list-item-heading\">\n    <!-- When href is provided, wrap heading text in <a href=\"…\"></a>;\n         otherwise plain text content is used. -->\n  </h3>\n\n  <!-- Optional meta line:\n       <p class=\"collection-list-item-meta\"></p> -->\n\n  <!-- Optional description:\n       <p class=\"collection-list-item-description\"></p> -->\n\n  <!-- Consumer may provide additional children below -->\n</li>";

const meta = {
  title: 'Headless/Collection List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
