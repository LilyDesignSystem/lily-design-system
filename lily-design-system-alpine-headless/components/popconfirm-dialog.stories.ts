import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyConfirm(false)\">\n  <button class=\"popconfirm-dialog-trigger\" x-bind=\"trigger\" aria-controls=\"popconfirm-dialog-1\"><!-- Consumer provides trigger label --></button>\n  <div class=\"popconfirm-dialog\" id=\"popconfirm-dialog-1\" role=\"alertdialog\" aria-modal=\"false\"\n       aria-labelledby=\"popconfirm-dialog-title\" aria-describedby=\"popconfirm-dialog-description\" x-bind=\"root\">\n    <h2 class=\"popconfirm-dialog-title\" id=\"popconfirm-dialog-title\"><!-- Consumer provides the title --></h2>\n    <p class=\"popconfirm-dialog-description\" id=\"popconfirm-dialog-description\"><!-- Consumer provides the description --></p>\n    <button class=\"popconfirm-dialog-cancel\" x-bind=\"cancelButton\"><!-- Consumer provides the cancel label --></button>\n    <button class=\"popconfirm-dialog-confirm\" x-bind=\"confirmButton\"><!-- Consumer provides the confirm label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Popconfirm Dialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
