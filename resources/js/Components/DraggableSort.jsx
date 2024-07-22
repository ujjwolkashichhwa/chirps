import React, { useState, useEffect } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ children }) => (
    <tr>{children}</tr>
));

const SortableDivItem = SortableElement(({ children }) => (
    <>{children}</>
));

const SortableList = SortableContainer(({ items, renderItem, type }) => {
    return (
        type === "table" ? (
            <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (
                    <SortableItem key={`item-${item.id}`} index={index}>
                        {renderItem(item)}
                    </SortableItem>
                ))}
            </tbody>
        ): (
            <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                {items?.map((item, index) => (
                    <SortableDivItem key={`item-${item.id}`} index={index}>
                        {renderItem(item)}
                    </SortableDivItem>
                ))}
            </div>
        )
    );
});

export default function DraggableSort({ items, renderItem, type, onSortEnd}) {
    const [sortedItems, setSortedItems] = useState();

    useEffect(()=>{
        // Sort items by sort_order before setting to state
        const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
        setSortedItems(sorted);
    }, [items]);

    const handleSortEnd = ({ oldIndex, newIndex }) => {
        const newSortedItems = arrayMove(sortedItems, oldIndex, newIndex).map((item, index) => ({
            ...item,
            sort_order: index + 1,
        }));

        setSortedItems(newSortedItems);

        if (onSortEnd) {
            onSortEnd(newSortedItems);
        }
    };

    return (
        <SortableList
            items={sortedItems}
            renderItem={renderItem}
            onSortEnd={handleSortEnd}
            type={type}
            lockAxis="y"
        />
    );
}