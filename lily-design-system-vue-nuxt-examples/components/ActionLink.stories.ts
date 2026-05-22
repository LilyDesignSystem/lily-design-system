import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ActionLink from './ActionLink.vue';

const meta = {
  title: 'Examples/ActionLink',
  component: ActionLink,
  tags: ['autodocs']
} satisfies Meta<typeof ActionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
