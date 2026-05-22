import type { Meta, StoryObj } from '@storybook/react-vite';
import DialGroup from './DialGroup';

const meta = {
  title: 'Headless/DialGroup',
  component: DialGroup,
  tags: ['autodocs']
} satisfies Meta<typeof DialGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
