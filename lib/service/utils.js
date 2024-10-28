
const translateSize = size => {
    return {
        text: `${size}mb`,
        number: size * 1000
    };
};

module.exports = {
    translateSize
};
