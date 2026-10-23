import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div> holding a listbox <div>\n  CSS class: wheel-picker (sub-elements: wheel-picker-list, wheel-picker-option)\n  Keyboard: ArrowDown / ArrowUp, Home / End, PageDown / PageUp, type-ahead over the labels; disabled options are skipped\n  Accessibility: role=\"listbox\" with aria-orientation=\"vertical\" and aria-activedescendant on the focusable list; each option\n    is role=\"option\" with aria-selected (and aria-disabled when disabled). The label is the consumer's.\n  Options: options [{ value, label, disabled? }], value, loop, pageSize, disabled. A `change` event fires with { value }.\n  Requires: Alpine.js with the Lily plugin (lily-alpine.js)\n-->\n\n<div\n  class=\"wheel-picker\"\n  x-data=\"lilyWheelPicker({ value: '2', options: [{ value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' }] })\"\n>\n  <div class=\"wheel-picker-list\" x-ref=\"list\" x-bind=\"list\" aria-label=\"\">\n    <template x-for=\"(option, index) in options\" :key=\"option.value\">\n      <div\n        class=\"wheel-picker-option\"\n        role=\"option\"\n        :id=\"`${uid}-option-${index}`\"\n        :aria-selected=\"String(index === selectedIndex)\"\n        :aria-disabled=\"option.disabled ? 'true' : null\"\n        :data-value=\"option.value\"\n        :data-index=\"index\"\n        x-text=\"option.label\"\n      ></div>\n    </template>\n  </div>\n</div>";

const meta = {
  title: 'Headless/WheelPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
