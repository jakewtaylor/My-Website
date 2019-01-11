export const getRandomInt = (min = 0, max = 1) => {
    let minimum = min;
    let maximum = max;

    minimum = Math.ceil(min);
    maximum = Math.floor(max);

    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

export const getRandomColor = () => `#${((1 << 24) * Math.random() | 0).toString(16)}`;
