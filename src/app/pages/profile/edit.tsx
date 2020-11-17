import React from 'react'
import {Prompt, useHistory, useParams} from "react-router-dom"
import { Helmet } from "react-helmet"
import { Field, Form, Formik } from "formik"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"

import styles from "./profile.module.css"
import { PantryContext } from "../../context"
import { Loading, Error} from "../"
import { User } from "../../types/user"
import {toast} from "react-toastify"

type AvatarState = {
    fileError?: string
    fileExt?: string
    file?: File
    newAvatar?: string | ArrayBuffer | null
    uploading: boolean
}

const Edit = () => {
    const {user, firestore, auth, storage, loading} = React.useContext(PantryContext)
    const {userId}: any = useParams()
    const history = useHistory()
    const toastId = React.useRef<any>()

    if(userId !== user?.uid){history.push(`/profile/${user}`)}
    const AvatarRef = storage?.ref(`profile/image`)
    const userRef = firestore?.doc(`/users/${user?.uid}`)
    const [{fileError, uploading, newAvatar, file, fileExt}, setState] = React.useState<AvatarState>({uploading: false})
    const [value, docLoading, err] = useDocumentDataOnce(userRef)

    const filePreview = (e: any) => {
        const file = e.target.files[0] as File
        if (file) {
            if(file.size > 3*1024*1024 /*3 MB*/ ){
                toast.error('File is too large')
                return
            }
            const reader = new FileReader()
            const fileExt = file.name.split('.').pop()
            reader.onload = (e) => {
                setState(prevState => ({...prevState, newAvatar: e.target?.result, fileExt, file}))
            }
            reader.readAsDataURL(file)
        }
    }
    const uploadAvatar = ({name, status, bio, username}: Partial<User>, file: File) => {
        const fileRef = AvatarRef?.child(`${user?.uid}/avatar.${fileExt}`)
        fileRef?.put(file).on('state_changed',
            ({bytesTransferred, totalBytes}) => {
                const progress = (bytesTransferred / totalBytes)
                if(toastId.current === null){
                    toastId.current = toast('Upload in Progress', {
                        progress,
                        type: "dark"
                    });
                } else {
                    toast.update(toastId.current, {
                        progress
                    })
                }
            },
            (e) => {
                toast.update(toastId.current, {type: "error", render: e.message})
            },
            () => {
                fileRef.updateMetadata({ cacheControl: "public,max-age=86400"})
                    .then(()=>{console.info(`Metadata uploaded`)})
                    .catch((e)=>{console.error(`Metadata update failed: ${e}`)})
                toast.dismiss(toastId.current)
                fileRef.getDownloadURL()
                    .then((avatar) => {
                        updateUser({name, status, avatar, bio, username})
                    })
                    .catch((e) => toast.error(e.message))
            })
    }
    const updateUser = ({name, status, avatar, bio, username}: Partial<User>) => {
        userRef?.update({name, status, avatar, bio, username})
            .then(()=> {
                auth?.currentUser?.updateProfile({photoURL: avatar, displayName: name})
                toast.success(`Profile Uploaded`, {toastId: 'profile'})
            })
            .then(()=> {
                setState(prevState => ({
                    ...prevState,
                    uploading: false
                }))
            })
            .then(()=>{
                history.push(`/profile`)
            })
            .catch(e => setState(prevState => ({...prevState, fileError: e})))
    }

    if(!user && !loading){history.push('/profile/login')}
    if(err){return <Error e={err.name} m={err.message}/>}
    if(loading || docLoading){return <Loading/>}
    else {
        const {name, status, username, bio, avatar} = value as User
        return (
            <>
                <Helmet title={"Profile"}/>
                <Formik initialStatus={false} initialValues={{name, status, username, bio}} onSubmit={({name, status, bio, username}) => {
                    setState(prevState => ({...prevState, uploading: true}))
                    if(fileExt && newAvatar && file){
                        uploadAvatar({name, status, bio, username}, file)
                    } else {
                        updateUser({name, status, bio, username})
                    }
                }}>
                    {({values, setStatus, status})=>
                        <Form>
                            <Prompt when={uploading || status} message={`Do you want to leave? You have unsaved progress here.`}/>
                            <h1>Edit Profile</h1>
                            <p style={{color: "salmon"}}>{fileError || ""}</p>
                            <label
                                title={'Click to change your profile'}
                                className={`${styles.avatar} ${styles.edit}`}
                                htmlFor={'avatar'}
                                style={{backgroundImage: `url(${newAvatar || avatar})`}}>
                                <small>Avatar:</small>
                                <div style={{backgroundColor: 'black'}}/>
                                <Field
                                    id={`avatar`}
                                    name={'avatar'}
                                    type={"file"}
                                    accept={"image/*"}
                                    onChange={(e: any) => {
                                        setState(prevState => ({
                                            ...prevState,
                                            fileError: ""
                                        }))
                                        setStatus(true)
                                        filePreview(e)
                                    }}
                                />
                            </label>
                            <label htmlFor={'name'} className={styles.name}>
                                <small>Name:</small>
                                <Field
                                    id={'name'}
                                    title={`Your name is ${values.name}`}
                                    autoComplete={"off"}
                                    name={'name'}
                                    type={"text"}
                                    placeholder={"Name"}
                                    onBlur={()=>setStatus(true)}
                                    size={30}
                                    required/>
                            </label>
                            <label htmlFor={'username'} className={styles.username}>
                                <small>Username:</small>
                                <Field
                                    id={'username'}
                                    title={`Your username is ${values.username}`}
                                    value={values.username || ""}
                                    type={'text'}
                                    autoComplete={"off"}
                                    name={'username'}
                                    placeholder={'Username'}
                                    //TODO: Add function to record username
                                    onBlur={()=>setStatus(true)}
                                    maxLength={30}
                                    size={30}
                                    />
                                <small>{}</small>
                            </label>
                            <label htmlFor={'status'} className={styles.status}>
                                <small>Status:</small>
                                <Field
                                    id={'status'}
                                    title={`Your status is ${values.status}`}
                                    autoComplete={"off"}
                                    type={"text"}
                                    name={'status'}
                                    placeholder={"Status"}
                                    onBlur={()=>setStatus(true)}
                                    maxLength={30}
                                    size={30}/>
                            </label>
                            <label htmlFor={'bio'} className={styles.bio}>
                                <small>Short Bio: {values.bio?.length || 0}/100</small>
                                <Field
                                    id={'bio'}
                                    title={`Your short bio is ${values.bio || "empty."}`}
                                    autoComplete={"off"}
                                    component={'textarea'}
                                    maxLength={100}
                                    cols={30}
                                    rows={4}
                                    name={'bio'}
                                    placeholder={"Your profile description"}
                                    onBlur={()=>setStatus(true)}
                                    />
                            </label>
                            <button className={uploading ? `btn disabled-btn` : `btn success-btn`} disabled={uploading} type={"submit"} onClick={()=>setStatus(false)}>Save profile</button>
                            <button className={`btn danger-btn`} type={"button"} onClick={()=>history.goBack()}>← Go Back</button>
                        </Form>
                    }
                </Formik>
            </>
        )
    }
}

export default Edit