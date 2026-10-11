import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CallToAction from './CallToAction.vue';

const meta = {
  title: 'Headless/CallToAction',
  component: CallToAction,
  tags: ['autodocs']
} satisfies Meta<typeof CallToAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
