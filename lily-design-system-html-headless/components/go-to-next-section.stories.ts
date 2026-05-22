import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a class="go-to-next-section" href="" aria-label=""></a>`;

const meta = {
  title: 'Headless/GoToNextSection',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
