import React, { useState, useEffect } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ children }) => (
    <tr>{children}</tr>
));

const SortableList = SortableContainer(({ items, renderItem }) => {
    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {items?.map((item, index) => (
                <SortableItem key={`item-${item.id}`} index={index}>
                    {renderItem(item)}
                </SortableItem>
            ))}
        </tbody>
    );
});

export default function DraggableSort({ items, renderItem, onSortEnd }) {
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
            lockAxis="y"
        />
    );
}