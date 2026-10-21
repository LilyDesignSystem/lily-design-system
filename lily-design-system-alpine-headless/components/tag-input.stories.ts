import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"tag-input\" role=\"group\" aria-label=\"\" x-data=\"lilyTagInput()\">\n  <ul class=\"tag-input-list\">\n    <template x-for=\"tag in tags\" :key=\"tag\">\n      <li class=\"tag-input-tag\">\n        <span x-text=\"tag\"></span>\n        <button type=\"button\" class=\"tag-input-remove\" aria-label=\"\" @click=\"remove(tag)\"><!-- Consumer provides remove label --></button>\n      </li>\n    </template>\n  </ul>\n  <input class=\"tag-input-control\" aria-label=\"\" x-bind=\"input\">\n</div>";

const meta = {
  title: 'Headless/Tag Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
