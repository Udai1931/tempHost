import { Alert, Button } from '@mui/material'
import React, { useState } from 'react'
import MovieIcon from '@mui/icons-material/Movie';
import LinearProgress from '@mui/material/LinearProgress';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
function Upload({ userData }) {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        const file = e.target.files[0]
        if (file == null) {
            setError("Please select a file first");
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }
        if (file.size / (1024 * 1024) > 50) {
            setError('This video is very big');
            setTimeout(() => {
                setError('')
            }, 2000);
            return;
        }
        let uid = uuidv4()
        setLoading(true)
        const storageRef = ref(storage, `${userData.uid}/Post/${uid}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(prog);
                console.log('Upload is ' + prog + '% done');
            },
            (error) => {
                // Handle unsuccessful uploads
                console.log(error)
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    let obj = {
                        likes: [],
                        postId: uid,
                        postUrl: downloadURL,
                        profileName: userData.name,
                        profileUrl: userData.profileUrl,
                        uid: userData.uid,
                        timestamp: serverTimestamp()
                    }
                    await setDoc(doc(db, "posts", uid), obj);
                    console.log("Post Added in db")
                    await updateDoc(doc(db, "users", userData.uid), {
                        posts: arrayUnion(uid)
                    })
                    console.log("Post Added in user")
                    setLoading(false)
                    setProgress(0)
                });
            }
        );
    }

    return (
        <div className="upload-btn">
            {
                error != '' ?
                    <Alert severity="error" sx={{ marginTop: '0.5rem' }} >{error}</Alert>
                    :
                    <>
                        <Button variant="outlined" fullWidth component="label" startIcon={<MovieIcon />} style={{ marginTop: '1rem' }} disabled={loading}>
                            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleChange} />
                            Upload
                        </Button>
                        {
                            loading &&
                            <LinearProgress variant="determinate" value={progress} style={{ marginTop: "0.2rem" }} />
                        }
                    </>
            }
        </div>
    )
}

export default Upload
