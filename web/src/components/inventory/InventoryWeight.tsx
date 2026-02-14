const InventoryWeight = ({ weight, maxWeight }: { weight: number; maxWeight: number }) => {
  const filledCount = getFilledSquares(weight, maxWeight);
  const totalSquares = 10;

  const squares = Array.from({ length: totalSquares }, (_, i) => i < filledCount);

  return (
    <div className="inventory-grid-header-weight">
      <div className="inventory-grid-header-weight-wrapper">
        <div className="inventory-grid-header-weight-value">
          <span className="weight-value">{weight / 1000}</span>
          <span className="weight-divider">/</span>
          <span className="weight-max">{maxWeight / 1000} kg</span>
        </div>
        <div className="inventory-grid-header-weight-visual">
          {squares.map((filled, idx) => (
            <Square key={idx} filled={filled} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryWeight;

const Square = ({ filled }: { filled: boolean }) => (
  <span className={`weight-square ${filled ? 'filled' : 'empty'}`} aria-hidden="true" />
);

const getFilledSquares = (currentWeight: number, maxWeight: number): number => {
  if (maxWeight <= 0) return 0;

  const ratio = Math.min(Math.max(currentWeight / maxWeight, 0), 1);

  // Convert the proportion to a count of squares.
  // `Math.round` gives the most natural "nearest‑square" feel.
  // You could also use `Math.floor` if you prefer “only colour what is completely filled”.
  return Math.round(ratio * 10);
};
