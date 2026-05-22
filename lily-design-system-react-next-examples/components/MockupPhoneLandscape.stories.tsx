import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupPhoneLandscape from './MockupPhoneLandscape';

const meta = {
  title: 'Examples/MockupPhoneLandscape',
  component: MockupPhoneLandscape,
  tags: ['autodocs']
} satisfies Meta<typeof MockupPhoneLandscape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
