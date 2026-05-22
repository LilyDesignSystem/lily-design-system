import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="pin-input-div"
  role="group"  data-pin-length="6">  <input
    class="pin-input-div-input"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    maxlength="1"
    autocomplete="one-time-code"
    id="pin-0"    value=""
    aria-label="Digit 1 of 6"  >  <input
    class="pin-input-div-input"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    maxlength="1"
    autocomplete="one-time-code"
    id="pin-1"    value=""
    aria-label="Digit 2 of 6"  >  <input
    class="pin-input-div-input"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    maxlength="1"
    autocomplete="one-time-code"
    id="pin-2"    value=""
    aria-label="Digit 3 of 6"  >  <input
    class="pin-input-div-input"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    maxlength="1"
    autocomplete="one-time-code"
    id="pin-3"    value=""
    aria-label="Digit 4 of 6"  >  <input
    class="pin-input-div-input"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    maxlength="1"
    autocomplete="one-time-code"
    id="pin-4"    value=""
    aria-label="Digit 5 of 6"  >  <input
    class="pin-input-div-input"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    maxlength="1"
    autocomplete="one-time-code"
    id="pin-5"    value=""
    aria-label="Digit 6 of 6"  ></div>`;

const meta = {
  title: 'Headless/PinInputDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
