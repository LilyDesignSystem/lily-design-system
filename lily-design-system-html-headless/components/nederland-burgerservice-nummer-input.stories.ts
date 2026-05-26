import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="nederland-burgerservice-nummer-input"
  type="text"
  aria-label="Citizen Service Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/NederlandBurgerserviceNummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
