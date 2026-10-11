import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupPhoneLandscape from './MockupPhoneLandscape';

const meta = {
  title: 'Headless/MockupPhoneLandscape',
  component: MockupPhoneLandscape,
  tags: ['autodocs']
} satisfies Meta<typeof MockupPhoneLandscape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
