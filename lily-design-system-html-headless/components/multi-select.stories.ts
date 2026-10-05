import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select
  class="multi-select"
  multiple
  aria-label="Toppings"
  size="4"
>
  <option value="cheese">Cheese</option>
  <option value="olives">Olives</option>
  <option value="peppers">Peppers</option>
  <option value="mushrooms">Mushrooms</option>
</select>`;

const meta = {
  title: 'Headless/MultiSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
