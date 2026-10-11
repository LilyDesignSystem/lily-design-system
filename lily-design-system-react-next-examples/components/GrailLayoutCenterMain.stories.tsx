import type { Meta, StoryObj } from '@storybook/react-vite';
import GrailLayoutCenterMain from './GrailLayoutCenterMain';

const meta = {
  title: 'Headless/GrailLayoutCenterMain',
  component: GrailLayoutCenterMain,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutCenterMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
