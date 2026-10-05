import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="multi-select-with-extras"><span>Before</span><select multiple aria-label="Toppings"><option value="a" selected>Cheese</option><option value="b">Olives</option></select><span>After</span></div>`;

const meta = {
  title: 'Headless/MultiSelectWithExtras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
