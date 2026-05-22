import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContextualHelp from './ContextualHelp.vue';

const meta = {
  title: 'Headless/ContextualHelp',
  component: ContextualHelp,
  tags: ['autodocs']
} satisfies Meta<typeof ContextualHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
