import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ClampText from './ClampText.vue';

const meta = {
  title: 'Examples/ClampText',
  component: ClampText,
  tags: ['autodocs']
} satisfies Meta<typeof ClampText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
