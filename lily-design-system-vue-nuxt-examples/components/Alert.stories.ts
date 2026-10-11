import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Alert from './Alert.vue';

const meta = {
  title: 'Headless/Alert',
  component: Alert,
  tags: ['autodocs']
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
