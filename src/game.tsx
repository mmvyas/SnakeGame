import React, { useEffect, useRef, useState } from 'react';
import { useFrameLoop } from './utils/frameLoop';

export const Game: React.FC<Props> = ({ }) => {
    const size = 512;
    const gridSize = 8;
    const initialSpeed = 8;
    const canvas = useRef<HTMLCanvasElement>();
    const speed = useRef(initialSpeed);

    const getApplePos = () => {
        return { x: getCoord(), y: getCoord() };
    }
    const getCoord = () => {
        const coord = 8 + (Math.random() * (size - 16));
        return coord - (coord % gridSize);
    }

    const y = useRef(Math.floor(size / 2));
    const x = useRef(Math.floor(size / 2));
    const apple = useRef(getApplePos());
    const dx = useRef(0);
    const dy = useRef(0);

    useFrameLoop(10, () => {
        if (!x.current)
            x.current = 0;
        if (!y.current)
            y.current = 0;

        moveSnake();

        if (isSnakeEating()) {
            eatApple();
        }

        if (canvas.current) {
            const context = canvas.current?.getContext('2d');

            if (context) {
                clearBoard(context);
                drawSnake(context);
                drawApple(context);
            }
            else
                console.log('No context');
        }
        else
            console.log('No canvas');
    });

    const moveSnake = () => {
        // Move the snake
        let newX = x.current + dx.current;
        let newY = y.current + dy.current;

        // Wrap around the screen
        if (newX > size)
            newX = 0;
        if (newY > size)
            newY = 0;

        if (newX < 0)
            newX = size;
        if (newY < 0)
            newY = size;

        // Apply changes
        x.current = newX;
        y.current = newY;
    };

    const clearBoard = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, size, size);
    }

    const drawSnake = (context: CanvasRenderingContext2D) => {
        drawSnakePart(context, x.current, y.current, gridSize, gridSize);
    }

    const drawSnakePart = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
        context.fillStyle = '#33ff33';
        context.fillRect(x, y, width, height);

        context.strokeStyle = '#006600';
        context.strokeRect(x, y, width, height);
    }

    const drawApple = (context: CanvasRenderingContext2D) => {
        context.fillStyle = '#ff0000';
        context.fillRect(apple.current.x, apple.current.y, gridSize, gridSize);
    }

    const isSnakeEating = () => {
        return x.current == apple.current.x && y.current == apple.current.y;
    }

    const eatApple = () => {
        console.log("yum");
        // Create new apple (secretly just move it tho)
        apple.current = getApplePos();
    }

    const controls = (ev: KeyboardEvent) => {
        switch (ev.key) {
            case 'ArrowUp':
            case 'w':
                if (dy.current == 0) {
                    dx.current = 0;
                    dy.current = -speed.current;
                }
                else if (dy.current < 0) {
                    y.current -= gridSize;
                }
                break;
            case 'ArrowDown':
            case 's':
                if (dy.current == 0) {
                    dx.current = 0
                    dy.current = speed.current;
                }
                else if (dy.current > 0) {
                    y.current += gridSize;
                }
                break;
            case 'ArrowLeft':
            case 'a':
                if (dx.current == 0) {
                    dx.current = -speed.current;
                    dy.current = 0;
                }
                else if (dx.current < 0) {
                    x.current -= gridSize;
                }
                break;
            case 'ArrowRight':
            case 'd':
                if (dx.current == 0) {
                    dx.current = speed.current;
                    dy.current = 0;
                }
                else if (dx.current > 0) {
                    x.current += gridSize;
                }
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', controls);

        return () => window.removeEventListener('keydown', controls);
    }, [ ]);

    return <div>
        <h1>Snake, there's a snake here, be careful (official title)!</h1>
        <canvas ref={canvas as any} width={size} height={size} style={{ background: '#eee', margin: '40px', border: '1px solid #333' }}></canvas>
    </div>
}

interface Props {
    //
}
