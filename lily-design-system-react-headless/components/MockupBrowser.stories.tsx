import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupBrowser from './MockupBrowser';

const meta = {
  title: 'Headless/MockupBrowser',
  component: MockupBrowser,
  tags: ['autodocs']
} satisfies Meta<typeof MockupBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
