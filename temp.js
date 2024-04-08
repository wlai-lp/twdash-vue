const timestamp = 1617372123000; // Example timestamp in milliseconds

const date = new Date(timestamp);
const formattedDate = date.toLocaleDateString('en-US')

console.log(formattedDate);