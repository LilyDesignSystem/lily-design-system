import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Organization from './Organization.vue';

const meta = {
  title: 'Headless/Organization',
  component: Organization,
  tags: ['autodocs']
} satisfies Meta<typeof Organization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
