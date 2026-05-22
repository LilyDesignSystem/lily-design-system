import type { Meta, StoryObj } from '@storybook/react-vite';
import Affix from './Affix';

const meta = {
  title: 'Headless/Affix',
  component: Affix,
  tags: ['autodocs']
} satisfies Meta<typeof Affix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
