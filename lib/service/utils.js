
const translateSize = size => {
  return {
    human: `${size}mb`,
    number: size * 1000
  };
};

module.exports = {
  translateSize
};
