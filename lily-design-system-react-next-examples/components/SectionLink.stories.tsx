import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SectionLink from './SectionLink';

const meta = {
  title: 'Examples/SectionLink',
  component: SectionLink,
  tags: ['autodocs']
} satisfies Meta<typeof SectionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
