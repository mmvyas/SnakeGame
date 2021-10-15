import React, { useEffect, useRef, useState } from "react";
import { useFrameLoop } from "./utils/frameLoop";
//import styled from "styled-components";
import "./index.css";

export const Game: React.FC<Props> = ({}) => {
  const size = 512;
  const gridSize = 8;
  const initialSpeed = 8;
  const canvas = useRef<HTMLCanvasElement>();
  const speed = useRef(initialSpeed);
  const score = useRef(0);
  const [scoreState, setScoreState] = useState(0);

  const getApplePos = () => {
    return { x: getCoord(), y: getCoord() };
  };

  const getCoord = () => {
    const coord = 8 + Math.random() * (size - 16);
    return coord - (coord % gridSize);
  };

  const mid = Math.floor(size / 2);

  const snake = useRef([
    { x: mid, y: mid },
    { x: mid + gridSize, y: mid },
    { x: mid + gridSize * 2, y: mid },
    { x: mid + gridSize * 3, y: mid },
  ]);

  // const y = useRef(Math.floor(size / 2));
  // const x = useRef(Math.floor(size / 2));
  // let x = 50;
  // let y = 50;
  // const arrX = useRef([ x, x+gridSize, x+2]);
  // const arrY = useRef([ y, y, y]);

  const apple = useRef(getApplePos());
  const dx = useRef(0);
  const dy = useRef(0);

  useFrameLoop(10, () => {
    // if (!arr.current[0])
    //     x.current = 0;
    // if (!y.current)
    //     y.current = 0;

    moveSnake();

    if (isSnakeEating()) {
      eatApple();
    }

    if (canvas.current) {
      const context = canvas.current?.getContext("2d");
      if (context) {
        clearBoard(context);
        drawSnake(context);
        drawApple(context);
      } else console.log("No context");
    } else console.log("No canvas");
  });

  const moveSnake = () => {
    // Move the snake
    let newX = snake.current[0].x + dx.current;
    let newY = snake.current[0].y + dy.current;

    // Wrap around the screen
    if (newX > size || newY > size || newX < 0 || newY < 0) {
      dx.current = 0;
      dy.current = 0;
      newX = mid;
      newY = mid;
      setScoreState(0);
      alert(
        `Game Over! Your Score was ${score.current}. Click OK to try again. Good luck!!!`
      );
    }

    // Apply changes

    // arrX.current[0] = newX;
    // arrY.current[0] = newY;
    snake.current.unshift({ x: newX, y: newY });
    snake.current.pop();
    // snake.current.unshift(snake.current[newY])
  };

  const clearBoard = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, size, size);
  };

  // const killSnake = ()=>{
  //     if(snake.current[0].x === gridSize && snake.current[0].y ===gridSize){
  //         setScorState(score.current + 10);
  //     }

  // }

  const drawSnake = (context: CanvasRenderingContext2D) => {
    for (let i = 0; i < snake.current.length; i++) {
      drawSnakePart(
        context,
        snake.current[i].x,
        snake.current[i].y,
        gridSize,
        gridSize
      );
    }
  };

  const drawSnakePart = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    context.fillStyle = "#33ff33";
    context.fillRect(x, y, width, height);

    context.strokeStyle = "#006600";
    context.strokeRect(x, y, width, height);
  };

  const drawApple = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "#ff0000";
    context.fillRect(apple.current.x, apple.current.y, gridSize, gridSize);
  };

  const isSnakeEating = () => {
    return (
      snake.current[0].x == apple.current.x &&
      snake.current[0].y == apple.current.y
    );
  };

  const eatApple = () => {
    console.log("yum");
    // Create new apple (secretly just move it tho)
    apple.current = getApplePos();
    setScoreState(score.current + 10);
  };

  const controls = (ev: KeyboardEvent) => {
    switch (ev.key) {
      case "ArrowUp":
      case "w":
        if (dy.current == 0) {
          dx.current = 0;
          dy.current = -speed.current;
        }
        // else if (dy.current < 0) {
        //     arrY.current[0] -= gridSize;
        // }
        break;
      case "ArrowDown":
      case "s":
        if (dy.current == 0) {
          dx.current = 0;
          dy.current = speed.current;
        }
        // else if (dy.current > 0) {
        //     arr.current[0] += gridSize;
        // }
        break;
      case "ArrowLeft":
      case "a":
        if (dx.current == 0) {
          dx.current = -speed.current;
          dy.current = 0;
        }
        // else if (dx.current < 0) {
        //     arr.current[0] -= gridSize;
        // }
        break;
      case "ArrowRight":
      case "d":
        if (dx.current == 0) {
          dx.current = speed.current;
          dy.current = 0;
        }
        // else if (dx.current > 0) {
        //     arr.current[0] += gridSize;
        // }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", controls);

    return () => window.removeEventListener("keydown", controls);
  }, []);
  useEffect(() => {
    // window.addEventListener('keydown', controls);

    // return () => window.removeEventListener('keydown', controls);
    score.current = scoreState;
  }, [scoreState]);

  return (
    <div>
      <h1>Snake, there's a snake here, be careful (official title)!</h1>
      <h2 className="fontStyle">{scoreState}</h2>
      <canvas
        ref={canvas as any}
        width={size}
        height={size}
        style={{ background: "#eee", margin: "40px", border: "1px solid #333" }}
      ></canvas>
    </div>
  );
};

// const fontStyle = styled.div`
// font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
//     monospace;
// `;

interface Props {
  //
}
