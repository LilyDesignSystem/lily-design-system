import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TabGroup from './TabGroup';

const meta = {
  title: 'Examples/TabGroup',
  component: TabGroup,
  tags: ['autodocs']
} satisfies Meta<typeof TabGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
