import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SkipLink from './SkipLink.vue';

const meta = {
  title: 'Headless/SkipLink',
  component: SkipLink,
  tags: ['autodocs']
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
