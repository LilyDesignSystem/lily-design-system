import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TelLink from './TelLink.vue';

const meta = {
  title: 'Headless/TelLink',
  component: TelLink,
  tags: ['autodocs']
} satisfies Meta<typeof TelLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
