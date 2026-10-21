import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"segment-group\" role=\"radiogroup\" aria-label=\"\" x-data=\"lilySegmentGroup('one')\" x-bind=\"group\">\n  <button class=\"segment-group-item\" x-bind=\"segment('one')\"><!-- Consumer provides label --></button>\n  <button class=\"segment-group-item\" x-bind=\"segment('two')\"><!-- Consumer provides label --></button>\n  <button class=\"segment-group-item\" x-bind=\"segment('three')\"><!-- Consumer provides label --></button>\n</div>";

const meta = {
  title: 'Headless/Segment Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
