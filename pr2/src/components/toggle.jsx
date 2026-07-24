import React , { useState, useEffect } from 'react';

function HookCounter() {
    const [count, setCount] = useState(0);
    const[name, setName] = useState('');

    useEffect(() => {
        console.log('useEffect - Updating document title');
        document.title = `You clicked ${count} times`;
    }, [count]);

    return (
        <div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    )
}

export default HookCounter;