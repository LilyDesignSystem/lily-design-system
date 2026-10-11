import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupPhonePortrait from './MockupPhonePortrait';

const meta = {
  title: 'Headless/MockupPhonePortrait',
  component: MockupPhonePortrait,
  tags: ['autodocs']
} satisfies Meta<typeof MockupPhonePortrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
