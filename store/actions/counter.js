export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESETCOUNT = 'RESETCOUNT';

export const increment = () => {
    return {
        type: INCREMENT
    }
}

export const decrement = () => {
    return {
        type: DECREMENT
    }
}

export const resetcount = () => {
    return {
        type: RESETCOUNT
    }
}