import type { Meta, StoryObj } from '@storybook/react-vite';
import FlexStack from './FlexStack';

const meta = {
  title: 'Headless/FlexStack',
  component: FlexStack,
  tags: ['autodocs']
} satisfies Meta<typeof FlexStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
