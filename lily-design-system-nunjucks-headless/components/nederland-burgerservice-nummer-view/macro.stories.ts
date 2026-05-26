import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="nederland-burgerservice-nummer-view"
  aria-label="Citizen Service Number">sample-value</span>`;

const meta = {
  title: 'Headless/NederlandBurgerserviceNummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
