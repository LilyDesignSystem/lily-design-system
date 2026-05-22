import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="step-list-item"
  data-status="waiting"></li>`;

const meta = {
  title: 'Headless/StepListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
