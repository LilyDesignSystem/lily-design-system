import type { Meta, StoryObj } from '@storybook/react-vite';
import UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput from './UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput';

const meta = {
  title: 'Headless/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput',
  component: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput,
  tags: ['autodocs']
} satisfies Meta<typeof UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput' }
};
