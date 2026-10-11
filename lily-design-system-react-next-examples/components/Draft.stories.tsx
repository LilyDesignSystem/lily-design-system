import type { Meta, StoryObj } from '@storybook/react-vite';
import Draft from './Draft';

const meta = {
  title: 'Headless/Draft',
  component: Draft,
  tags: ['autodocs']
} satisfies Meta<typeof Draft>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
