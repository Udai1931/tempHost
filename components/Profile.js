import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth'
import { db } from '../firebase'
import Navbar from './Navbar'
function Profile() {

    const { user } = useContext(AuthContext)

    const [userData, setUserData] = useState({})
    const [postIds, setPostIds] = useState([])
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(doc(db, "users", user?.uid), (doc) => {
                setUserData(doc.data())
                setPostIds(doc.data().posts)
            })
        }
        // return () => {
        //     unsub();
        // }
    }, [user])


    useEffect(() => {
        let tempArray = []
        postIds.map((postId) => {
            const unsub = onSnapshot(doc(db, "posts", postId), (doc) => {
                tempArray.push(doc.data())
                setPosts([...tempArray])
            })
        })

    }, [postIds])


    return (
        <div>
            <Navbar />
            <div className='container'>
                <div className='profile-upper'>
                    <img src={userData.profileUrl} style={{ height: "8rem", width: "8rem", borderRadius: "50%" }} />
                    <div style={{ flexBasis: "40%" }}>
                        <h1>{userData?.name}</h1>
                        <h3>Posts : {userData?.posts?.length}</h3>
                    </div>
                </div>
                <hr />
                <div className='profile-videos-container'>
                    {
                        posts.map((post) => (
                            <video key={post.postId} src={post.postUrl} />
                        ))
                    }
                    <img src="" />
                </div>
            </div>
        </div>
    )
}

export default Profile