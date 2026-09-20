import base from '@dnd-mapp/config-prettier';

/** @type {import('prettier').Config} */
const config = {
    ...base,
    plugins: ['prettier-plugin-organize-imports'],
};

export default config;
