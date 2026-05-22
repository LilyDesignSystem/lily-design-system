import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="password-input-or-text-input-div"
  data-module="password-input-or-text-input-div">
  <input
    class="password-input-or-text-input-div-input"
    type="password"    value=""    autocomplete="current-password"
  >
  <button
    class="password-input-or-text-input-div-toggle"
    type="button"
    data-show-label="Show"
    data-hide-label="Hide"
    aria-pressed="false"  >Show</button>
</div>`;

const meta = {
  title: 'Headless/PasswordInputOrTextInputDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
