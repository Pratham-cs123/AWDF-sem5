import React, { useState } from 'react'; // Added this import

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Counter Component</h1>
            <p>Current Count: {count}</p>
            <button style={{ color: 'white', backgroundColor: 'grey' }} onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

export default Counter;
