import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FloatingPanel from './FloatingPanel.vue';

const meta = {
  title: 'Headless/FloatingPanel',
  component: FloatingPanel,
  tags: ['autodocs']
} satisfies Meta<typeof FloatingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
