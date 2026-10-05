import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select class="multi-select" multiple aria-label="Toppings"><option value="a" selected>Cheese</option><option value="b">Olives</option></select>`;

const meta = {
  title: 'Headless/MultiSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
