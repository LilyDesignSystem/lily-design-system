import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView from './UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.vue';

const meta = {
  title: 'Headless/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView',
  component: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView,
  tags: ['autodocs']
} satisfies Meta<typeof UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView' }
};
