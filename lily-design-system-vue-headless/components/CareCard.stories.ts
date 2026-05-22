import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CareCard from './CareCard.vue';

const meta = {
  title: 'Headless/CareCard',
  component: CareCard,
  tags: ['autodocs']
} satisfies Meta<typeof CareCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
