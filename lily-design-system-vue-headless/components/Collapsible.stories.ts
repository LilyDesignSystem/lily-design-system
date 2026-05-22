import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Collapsible from './Collapsible.vue';

const meta = {
  title: 'Headless/Collapsible',
  component: Collapsible,
  tags: ['autodocs']
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
