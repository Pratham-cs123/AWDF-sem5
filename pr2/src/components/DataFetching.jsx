import React, {useEffect, useState} from "react";
import axios from "axios";

// function DataFetching() {
//     const [post, setPosts] = useState([]);

//     useEffect(() => {
//         axios.get('https://jsonplaceholder.typicode.com/posts')
//         .then(res => {
//             console.log(res);
//             setPosts(res.data);
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }, []);

//     return (
//         <div>
//             <ul>
//                 {
//                     post.map(post => <li key = {post.id}>   {post.title}</li>)
//                 }
//             </ul>
//         </div>
//     )
// }

//data fetching with onclick event
function DataFetching() {
    const [post, setPosts] = useState([]);
    const [id, setId] = useState(1);
    const [idByButtonClick, setIdByButtonClick] = useState(1);

    const clickButton = () => {
        setIdByButtonClick(id);
    }
    useEffect(() => {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${idByButtonClick}`)
        .then(res => {
            console.log(res);
            setPosts(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [idByButtonClick]); // adding id as dependency so that it will run when id changes

    return (
        <div>
            {/* data fetch by button */}
            <input type="text" value={id} onChange={e => setId(e.target.value)} />
            <button onClick={clickButton}>Fetch Post</button>
            <div>{post.title}</div>
            {/* data fetch by id mapping */}
            {/* <ul>
                {
                    post.map(post => <li key = {post.id}>   {post.title}</li>)
                }
            </ul> */}
        </div>
    )
}

export default DataFetching;