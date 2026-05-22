import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Coachmark from './Coachmark.vue';

const meta = {
  title: 'Headless/Coachmark',
  component: Coachmark,
  tags: ['autodocs']
} satisfies Meta<typeof Coachmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
