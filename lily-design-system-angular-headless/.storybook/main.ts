import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.ts"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
};

export default config;
