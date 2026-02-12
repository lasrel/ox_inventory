import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getTotalWeight } from '../../helpers';
import { useIntersection } from '../../hooks/useIntersection';
import { useAppSelector } from '../../store';
import { Inventory, InventoryType } from '../../typings';
import InventorySlot from './InventorySlot';
import InventoryWeight from './InventoryWeight';

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const PAGE_SIZE = 40;
  const HOT_SLOT_COUNT = 5;

  const pagedItems = inventory.items.slice(0, (page + 1) * PAGE_SIZE);

  const hotSlots = pagedItems.filter((item) => item.slot <= HOT_SLOT_COUNT);
  const mainSlots =
    inventory.type === InventoryType.PLAYER ? pagedItems.filter((item) => item.slot > HOT_SLOT_COUNT) : pagedItems;

  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div className="inventory-grid-header-wrapper">
          <p className="inventory-grid-header-label">{inventory.label}</p>
          {inventory.maxWeight && <InventoryWeight weight={weight} maxWeight={inventory.maxWeight} />}
        </div>

        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {mainSlots.map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>

        {inventory.type === InventoryType.PLAYER && (
          <div className="inventory-hot-slots">
            {hotSlots.map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
                isHotSlot
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default InventoryGrid;
