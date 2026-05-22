import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InformationCallout from './InformationCallout';

const meta = {
  title: 'Examples/InformationCallout',
  component: InformationCallout,
  tags: ['autodocs']
} satisfies Meta<typeof InformationCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
