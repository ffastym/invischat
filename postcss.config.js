module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('postcss-import'),
        require('postcss-mixins'),
        require('precss'),
        require('postcss-preset-env')({stage: 1}),
        require('postcss-simple-vars'),
        require('postcss-extend'),
        require('postcss-nesting'),
        require('postcss-custom-media'),
        require('postcss-discard-comments'),
        require('css-mqpacker'),
        require('stylelint'),
        require('autoprefixer')
    ]
};