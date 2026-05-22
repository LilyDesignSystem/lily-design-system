import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SectionNav from './SectionNav';

const meta = {
  title: 'Examples/SectionNav',
  component: SectionNav,
  tags: ['autodocs']
} satisfies Meta<typeof SectionNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
