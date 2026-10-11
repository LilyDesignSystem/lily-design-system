import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FlexStack from './FlexStack.vue';

const meta = {
  title: 'Headless/FlexStack',
  component: FlexStack,
  tags: ['autodocs']
} satisfies Meta<typeof FlexStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
