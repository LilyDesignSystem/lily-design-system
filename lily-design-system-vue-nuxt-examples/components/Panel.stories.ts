import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Panel from './Panel.vue';

const meta = {
  title: 'Headless/Panel',
  component: Panel,
  tags: ['autodocs']
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
