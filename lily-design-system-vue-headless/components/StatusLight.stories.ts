import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StatusLight from './StatusLight.vue';

const meta = {
  title: 'Headless/StatusLight',
  component: StatusLight,
  tags: ['autodocs']
} satisfies Meta<typeof StatusLight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
