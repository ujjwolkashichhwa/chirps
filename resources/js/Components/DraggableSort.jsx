import React, { useState, useEffect } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(({children, childContainer: ChildContainer, ...props }) => (
    ChildContainer ? (
        <ChildContainer {...props}>{children}</ChildContainer>
    ) : (
        <>{children}</>
    )
));

const SortableList = SortableContainer(({ items, renderItem, container: Container, childContainer, ...props }) => {
    return (
        <Container {...props}>
            {items?.map((item, index) => (
                <SortableItem key={`item-${item.id}`} index={index} childContainer={childContainer}>
                    {renderItem(item)}
                </SortableItem>
            ))}
        </Container>
    );
});

export default function DraggableSort({ items, renderItem, container, className, childContainer, onSortEnd, ...props }) {
    const [sortedItems, setSortedItems] = useState();

    useEffect(() => {
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

    const shouldCancelStart = (e) => {
        // Prevent drag if the target element or any of its parents have the 'no-drag' class
        if (e.target.closest('.no-drag')) {
            return true;
        }
        return false;
    };

    return (
        <SortableList
            items={sortedItems}
            renderItem={renderItem}
            onSortEnd={handleSortEnd}
            container={container}
            className={className}
            childContainer={childContainer}
            lockAxis="y"
            shouldCancelStart={shouldCancelStart}
            {...props}
        />
    );
}