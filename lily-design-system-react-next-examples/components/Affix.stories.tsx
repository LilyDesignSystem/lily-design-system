import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Affix from './Affix';

const meta = {
  title: 'Examples/Affix',
  component: Affix,
  tags: ['autodocs']
} satisfies Meta<typeof Affix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
