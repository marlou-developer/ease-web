export default function peso_value(value) {
    const num = (value == null || isNaN(Number(value))) ? 0 : Number(value);
    return `₱ ${num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}