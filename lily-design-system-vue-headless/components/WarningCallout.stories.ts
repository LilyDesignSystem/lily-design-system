import type { Meta, StoryObj } from '@storybook/vue3-vite';
import WarningCallout from './WarningCallout.vue';

const meta = {
  title: 'Headless/WarningCallout',
  component: WarningCallout,
  tags: ['autodocs']
} satisfies Meta<typeof WarningCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
