import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GovernmentBanner from './GovernmentBanner.vue';

const meta = {
  title: 'Headless/GovernmentBanner',
  component: GovernmentBanner,
  tags: ['autodocs']
} satisfies Meta<typeof GovernmentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
