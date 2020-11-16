import React from 'react'
import {Prompt, useHistory, useParams} from "react-router-dom"
import { Helmet } from "react-helmet"
import { Field, Form, Formik } from "formik"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"

import styles from "./profile.module.css"
import {appAuth, appFirestore, appStorage} from "../../config"
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
    const {id} = React.useContext(PantryContext)
    const {user}: any = useParams()
    const history = useHistory()
    const uploadId = React.useRef<any>(null)
    if(user !== id){history.push(`/profile/${user}`)}
    const AvatarRef = appStorage.ref(`profile/image`)
    const userRef = appFirestore.doc(`/users/${id}`)
    const [{fileError, uploading, newAvatar, file, fileExt}, setState] = React.useState<AvatarState>({uploading: false})
    const [value, loading, err] = useDocumentDataOnce(userRef)

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

    if(!id){history.push('/profile/login')}
    if(err){return <Error e={err.name} m={err.message}/>}
    if(loading){return <Loading/>}
    else {
        const {name, status, avatar} = value as User
        return (
            <>
                <Helmet title={"Profile"}/>
                <Formik initialStatus={false} initialValues={{name, status}} onSubmit={({name, status}) => {
                    setState(prevState => ({...prevState, uploading: true}))
                    if(fileExt && newAvatar && file){
                        const fileRef = AvatarRef.child(`${id}/avatar.${fileExt}`)
                        fileRef.put(file).on('state_changed',
                            async ({bytesTransferred, totalBytes}) => {
                                const progress = (bytesTransferred / totalBytes)
                                if (uploadId.current === null) {
                                    uploadId.current = toast.warning('Upload in progress...', {
                                        progress,
                                        autoClose: 5000
                                    })
                                } else {
                                    toast.update(uploadId.current, {progress})
                                }
                            },
                            (e) => {
                                toast.update(uploadId.current, {type: "error"})
                                toast.error(e.message)
                            },
                            () => {
                                fileRef.updateMetadata({ cacheControl: "public,max-age=86400"})
                                    .then((metadata)=>{console.info(`Metadata uploaded: ${metadata}`)})
                                    .catch((e)=>{console.error(`Metadata update failed: ${e}`)})
                                toast.update(uploadId.current, {type: "success"})
                                fileRef.getDownloadURL()
                                    .then((url: string) => {
                                        toast.dismiss(uploadId.current)
                                        uploadId.current = null
                                        userRef.update({name, status, avatar: url})
                                            .then(()=> {
                                                appAuth.currentUser?.updateProfile({photoURL: url})
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
                                    })
                                    .catch((e) => toast.error(e.message))

                            })
                    } else {
                        userRef.update({name, status})
                            .then(()=> {
                                toast.success(`Profile Uploaded`, {toastId: 'profile'})
                                setState(prevState => ({...prevState, uploading: false}))
                                history.push(`/profile`)
                            })
                            .catch(e => setState(prevState => ({...prevState, fileError: e, uploading: false})))
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
                            <label htmlFor={'name'} className={styles.profileLabel}>
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
                            <label htmlFor={'status'} className={styles.profileLabel}>
                                <small>Status:</small>
                                <Field
                                    id={'status'}
                                    title={`Your status is ${values.status}`}
                                    autoComplete={"off"}
                                    type={"text"}
                                    name={'status'}
                                    placeholder={"Status"}
                                    onBlur={()=>setStatus(true)}
                                    size={30}/>
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