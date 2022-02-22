import { Avatar } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Upload from './Upload'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from '../context/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Post from './Post';

function Feed() {

    const {user} = useContext(AuthContext)

    const [userData,setUserData] = useState({})
    const [posts,setPosts] = useState([])

    useEffect(()=>{
        const unsub = onSnapshot(doc(db,"users",user.uid),(doc)=>{
            setUserData(doc.data())
        })

        return ()=>{
            unsub();
        }
    },[user])

    useEffect(()=>{
        const unsub = onSnapshot(query(collection(db,"posts"),orderBy('timestamp','desc')),(snapshot)=>{
            let tempArray = []
            snapshot.docs.map((doc)=>{
                tempArray.push(doc.data())
            })
            setPosts([...tempArray])
        })

        return ()=>{
            unsub();
        }
    },[])


    const callback = (entries) => {
        entries.forEach((entry)=>{
            let ele = entry.target
            ele.play().then(()=>{
                if(!ele.paused && !entry.isIntersecting){
                    ele.pause()
                }
            })
        })
    }

    let observer = new IntersectionObserver(callback,{threshold:0.6});

    useEffect(()=>{
        const elements = document.querySelectorAll(".post-container video");
        elements.forEach((element)=>{
            observer.observe(element)
        })
        return ()=>{
            observer.disconnect();
        }
    },[posts])

    return (
        <div className="feed-container">
            {/* Navbar */}
            <Navbar userData={userData}/>
            {/* upload videos */}
            <Upload userData={userData}/>
            {/* reels */}
            <div className="videos-container">
                {
                    posts.map((post)=>(
                        <Post key={post.postId} postData={post} userData={userData}/>
                    ))
                }
            </div>
        </div>
    )
}

export default Feed
