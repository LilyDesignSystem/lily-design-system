import type { Meta, StoryObj } from '@storybook/react-vite';
import InformationCallout from './InformationCallout';

const meta = {
  title: 'Headless/InformationCallout',
  component: InformationCallout,
  tags: ['autodocs']
} satisfies Meta<typeof InformationCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
