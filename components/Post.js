import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Post(props) {

    const [like, setLike] = useState(false)

    useEffect(() => {
        if (props.postData.likes.includes(props.userData.uid)) {
            setLike(true)
        } else {
            setLike(false)
        }
    }, [props])

    const handleLike = async () => {
        if (like) {
            await updateDoc(doc(db, "posts", props.postData.postId), {
                likes: arrayRemove(props.userData.uid)
            })
            console.log("Unliked")
        }else{
            await updateDoc(doc(db, "posts", props.postData.postId), {
                likes: arrayUnion(props.userData.uid)
            })
            console.log("Liked")
        }
    }

    return (
        <div className="post-container">
            <video src={props.postData.postUrl} muted/>
            <div className="videos-info">
                <div className="avatar_container">
                    <Avatar alt="Remy Sharp" src={props.postData.profileUrl} sx={{ margin: "0.5rem" }} />
                    <p style={{ color: "white" }}>{props.postData.profileName}</p>
                </div>

                <div className="post-like">
                    <FavoriteIcon onClick={handleLike} fontSize="large" style={like ? { color: 'red' } : { color: "white" }} />
                    {props.postData.likes.length > 0 && props.postData.likes.length}
                </div>
            </div>
        </div>
    )
}

export default Post
