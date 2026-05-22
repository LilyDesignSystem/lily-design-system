import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MenuGroup from './MenuGroup';

const meta = {
  title: 'Examples/MenuGroup',
  component: MenuGroup,
  tags: ['autodocs']
} satisfies Meta<typeof MenuGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
