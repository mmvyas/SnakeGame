import React, { useEffect, useRef } from 'react';

export const useFrameLoop = (refreshRate: number, callback: () => void) => {
    const requestId = useRef<number>();
    const frameTime = Math.round(1000 / refreshRate);

    const loop = (time: number) => {
        callback();

        requestId.current = setTimeout(loop, frameTime);
    }

    useEffect(() => {
        requestId.current = setTimeout(loop, frameTime);

        return () => clearTimeout(requestId?.current || 0);
    }, []);
}
