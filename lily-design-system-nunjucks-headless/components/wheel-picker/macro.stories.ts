import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="wheel-picker" data-page-size="5"><div class="wheel-picker-list" role="listbox" aria-orientation="vertical" aria-label="Month" aria-activedescendant="wheel-picker-option-1" tabindex="0"><div class="wheel-picker-option" role="option" id="wheel-picker-option-0" aria-selected="false" data-value="1">January</div><div class="wheel-picker-option" role="option" id="wheel-picker-option-1" aria-selected="true" data-value="2">February</div><div class="wheel-picker-option" role="option" id="wheel-picker-option-2" aria-selected="false" data-value="3">March</div></div></div>`;

const meta = {
  title: 'Headless/WheelPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
