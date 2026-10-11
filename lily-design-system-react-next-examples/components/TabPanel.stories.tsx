import type { Meta, StoryObj } from '@storybook/react-vite';
import TabPanel from './TabPanel';

const meta = {
  title: 'Headless/TabPanel',
  component: TabPanel,
  tags: ['autodocs']
} satisfies Meta<typeof TabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
