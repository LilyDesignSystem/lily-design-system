import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select multiple aria-label="Example"> ... </select>
      <!-- after content -->
    </div>
-->

<div class="multi-select-with-extras">
  <span class="multi-select-with-extras-before">Choose toppings</span>
  <select multiple aria-label="Toppings" size="4">
    <option value="cheese">Cheese</option>
    <option value="olives">Olives</option>
    <option value="peppers">Peppers</option>
    <option value="mushrooms">Mushrooms</option>
  </select>
  <span class="multi-select-with-extras-after">Hold Ctrl or Cmd to select several</span>
</div>`;

const meta = {
  title: 'Headless/MultiSelectWithExtras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
