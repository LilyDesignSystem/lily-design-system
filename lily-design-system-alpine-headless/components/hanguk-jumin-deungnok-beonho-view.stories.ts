import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"hanguk-jumin-deungnok-beonho-view\"\n  aria-label=\"Resident Registration Number (주민등록번호)\"\n></span>";

const meta = {
  title: 'Headless/Hanguk Jumin Deungnok Beonho View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
