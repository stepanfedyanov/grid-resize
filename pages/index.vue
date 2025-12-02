<template>
    <div class="fokus-container" :style="styles.fokusContainer2">
        <div class="fokus-element item1" ref="item1" :style="{ ...styles.fokusElement2, ...styles.item1 }">
            <p>item1</p>
            <div class="resize-handle top" @mousedown="startResize('item1', 'top', $event)"></div>
            <div class="resize-handle bottom" @mousedown="startResize('item1', 'bottom', $event)"></div>
            <div class="resize-handle left" @mousedown="startResize('item1', 'left', $event)"></div>
            <div class="resize-handle right" @mousedown="startResize('item1', 'right', $event)"></div>
        </div>
        <div class="fokus-element item2" ref="item2" :style="{ ...styles.fokusElement2, ...styles.item2 }">
            <p>item2</p>
            <div class="resize-handle top" @mousedown="startResize('item2', 'top', $event)"></div>
            <div class="resize-handle bottom" @mousedown="startResize('item2', 'bottom', $event)"></div>
            <div class="resize-handle left" @mousedown="startResize('item2', 'left', $event)"></div>
            <div class="resize-handle right" @mousedown="startResize('item2', 'right', $event)"></div>
        </div>
        <div class="fokus-element item3" ref="item3" :style="{ ...styles.fokusElement2, ...styles.item3 }">
            <p>item3</p>
            <div class="resize-handle top" @mousedown="startResize('item3', 'top', $event)"></div>
            <div class="resize-handle bottom" @mousedown="startResize('item3', 'bottom', $event)"></div>
            <div class="resize-handle left" @mousedown="startResize('item3', 'left', $event)"></div>
            <div class="resize-handle right" @mousedown="startResize('item3', 'right', $event)"></div>
        </div>
        <div class="fokus-element item4" ref="item4" :style="{ ...styles.fokusElement2, ...styles.item4 }">
            <p>item4</p>
            <div class="resize-handle top" @mousedown="startResize('item4', 'top', $event)"></div>
            <div class="resize-handle bottom" @mousedown="startResize('item4', 'bottom', $event)"></div>
            <div class="resize-handle left" @mousedown="startResize('item4', 'left', $event)"></div>
            <div class="resize-handle right" @mousedown="startResize('item4', 'right', $event)"></div>
        </div>
    </div>
</template>

<script>
import styles from '../styles.json';

export default {
    data() {
        return {
            styles,
            resizing: null,
            direction: null,
            startY: 0,
            startHeight: 0,
            startX: 0,
            startWidth: 0,
            containerRef: null,
            parsedGridAreas: [],
        };
    },
    mounted() {
        this.containerRef = this.$el;
        this.parsedGridAreas = this.parseGridTemplateAreas(this.styles.fokusContainer2.gridTemplateAreas);
    },
    methods: {
        startResize(item, direction, event) {
            this.resizing = item;
            this.direction = direction;
            const el = this.$refs[item];

            this.startHeight = el.offsetHeight;
            this.startWidth = el.offsetWidth;
            this.startY = event.clientY;
            this.startX = event.clientX;

            document.addEventListener('mousemove', this.resize);
            document.addEventListener('mouseup', this.stopResize);
        },
        resize(event) {
            const deltaY = event.clientY - this.startY;
            const deltaX = event.clientX - this.startX;
            const el = this.$refs[this.resizing];

            if (this.direction === 'bottom' || this.direction === 'top') {
                this.adjustGridRows(deltaY);
            }

            if (this.direction === 'right' || this.direction === 'left') {
                this.adjustGridColumns(deltaX);
            }
        },
        adjustGridRows(deltaY) {
            const gridTemplateRows = this.styles.fokusContainer2.gridTemplateRows.split(' ');
            const itemRowIndex = this.getItemRowIndex(this.resizing);

            const containerHeight = this.containerRef.offsetHeight;
            let newHeight = this.startHeight + (this.direction === 'bottom' ? deltaY : -deltaY);

            if (newHeight < 50) newHeight = 50; // Минимальная высота
            if (containerHeight - newHeight < 50) {
                newHeight = containerHeight - 50; // Максимальная высота
            }

            const newHeightPercentage = (newHeight / containerHeight) * 100;
            gridTemplateRows[itemRowIndex] = `${newHeightPercentage}%`;

            const totalHeight = gridTemplateRows.reduce((acc, curr) => acc + parseFloat(curr), 0);
            const heightAdjustment = 100 - totalHeight;

            gridTemplateRows.forEach((row, index) => {
                if (index !== itemRowIndex) {
                    gridTemplateRows[index] = `${(parseFloat(row) + (heightAdjustment / (gridTemplateRows.length - 1))).toFixed(4)}%`;
                }
            });

            this.styles.fokusContainer2.gridTemplateRows = gridTemplateRows.join(' ');
        },

        adjustGridColumns(deltaX) {
            const gridTemplateColumns = this.styles.fokusContainer2.gridTemplateColumns.split(' ');
            const itemColIndex = this.getItemColIndex(this.resizing);

            const containerWidth = this.containerRef.offsetWidth;
            let newWidth = this.startWidth + (this.direction === 'right' ? deltaX : -deltaX);

            if (newWidth < 50) newWidth = 50;
            if (containerWidth - newWidth < 50) {
                newWidth = containerWidth - 50;
            }

            const newWidthPercentage = (newWidth / containerWidth) * 100;
            gridTemplateColumns[itemColIndex] = `${newWidthPercentage}%`;

            const totalWidth = gridTemplateColumns.reduce((acc, curr) => acc + parseFloat(curr), 0);
            const widthAdjustment = 100 - totalWidth;

            gridTemplateColumns.forEach((col, index) => {
                if (index !== itemColIndex) {
                    gridTemplateColumns[index] = `${(parseFloat(col) + (widthAdjustment / (gridTemplateColumns.length - 1))).toFixed(4)}%`;
                }
            });

            this.styles.fokusContainer2.gridTemplateColumns = gridTemplateColumns.join(' ');
        },
        parseGridTemplateAreas(areas) {
            return areas.split('" "').map(row => row.replace(/"/g, '').split(' '));
        },

        getItemRowIndex(item) {
            for (let rowIndex = 0; rowIndex < this.parsedGridAreas.length; rowIndex++) {
                if (this.parsedGridAreas[rowIndex].includes(item)) {
                    return rowIndex;
                }
            }
            return -1;
        },

        getItemColIndex(item) {
            for (let rowIndex = 0; rowIndex < this.parsedGridAreas.length; rowIndex++) {
                const colIndex = this.parsedGridAreas[rowIndex].indexOf(item);
                if (colIndex !== -1) {
                    return colIndex;
                }
            }
            return -1;
        },
        stopResize() {
            document.removeEventListener('mousemove', this.resize);
            document.removeEventListener('mouseup', this.stopResize);
        },
    }
};
</script>

<style>
body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.fokus-container {
    margin: 0 auto;
    aspect-ratio: 16/9;
    background-color: #ddd;
    border-radius: 10px;
    flex-shrink: 0;
    height: 30vw;
    max-width: 53.3333333333vw;
    min-width: 53.3333333333vw;
    overflow: hidden;
    z-index: 2;
    position: relative;
    /* Добавлено для позиционирования размеров */
}

.resize-handle {
    position: absolute;
    background: rgba(255, 255, 255, 0);
    /* Курсор изменения размера */
}

.resize-handle.top {
    top: 0px;
    /* Положение выше блока */
    left: 50%;
    width: 100%;
    height: 15px;
    transform: translateX(-50%);
    cursor: n-resize;
}

.resize-handle.bottom {
    bottom: 0px;
    /* Положение ниже блока */
    left: 50%;
    width: 100%;
    height: 15px;
    transform: translateX(-50%);
    cursor: s-resize;
}

.resize-handle.left {
    top: 50%;
    left: 0px;
    /* Положение слева от блока */
    width: 15px;
    height: 100%;
    transform: translateY(-50%);
    cursor: ew-resize;
}

.resize-handle.right {
    top: 50%;
    right: 0px;
    /* Положение справа от блока */
    width: 15px;
    height: 100%;
    transform: translateY(-50%);
    cursor: ew-resize;
}
</style>
