import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BackLink from './BackLink.vue';

const meta = {
  title: 'Examples/BackLink',
  component: BackLink,
  tags: ['autodocs']
} satisfies Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
