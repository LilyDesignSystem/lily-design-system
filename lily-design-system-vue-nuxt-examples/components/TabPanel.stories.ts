import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TabPanel from './TabPanel.vue';

const meta = {
  title: 'Headless/TabPanel',
  component: TabPanel,
  tags: ['autodocs']
} satisfies Meta<typeof TabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
