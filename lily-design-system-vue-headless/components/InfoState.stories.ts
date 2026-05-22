import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InfoState from './InfoState.vue';

const meta = {
  title: 'Headless/InfoState',
  component: InfoState,
  tags: ['autodocs']
} satisfies Meta<typeof InfoState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
