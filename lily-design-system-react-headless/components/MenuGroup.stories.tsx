import type { Meta, StoryObj } from '@storybook/react-vite';
import MenuGroup from './MenuGroup';

const meta = {
  title: 'Headless/MenuGroup',
  component: MenuGroup,
  tags: ['autodocs']
} satisfies Meta<typeof MenuGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
