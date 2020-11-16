import React from 'react'
import {FastField, Formik, Form, useFormikContext, useField, FieldArray} from "formik"
import {Prompt} from 'react-router-dom'
import {Pantry} from "../../types/pantry"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import styles from "./pantry.module.css"
import {Helmet} from "react-helmet";

const newPantry: Pantry = {
    owner: "",
    sharedWith: [],
    note: "",
    name: "",
    ingredients: []
}

const DatePickerField = (props: any) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);

    const formatDate = (date: any) => (date.seconds) ? date.toDate() : date

    return (
        <DatePicker
            {...field}
            {...props}
            selected={formatDate(field.value)}
            autoComplete={'off'}
            onChange={val => {
                if(val)setFieldValue(field.name, val)
            }}
        />
    )
}

const IngredientFieldArray = ({onEdit}: any) => {
    const { values }: { values: Pantry } = useFormikContext()
    return(
        <FieldArray name={`ingredients`} render={arrayHelpers => (
            <div className={styles.ingredients}>
                <datalist id={`ingredient-types`}>
                    {}
                    <option value={"Fruit"}/>
                    <option value={"Seed"}/>
                    <option value={"Vegetable"}/>
                    <option value={"Poultry"}/>
                    <option value={"Beef"}/>
                    <option value={"Pork"}/>
                    <option value={"Fish"}/>
                    <option value={"Shellfish"}/>
                    <option value={"Oil"}/>
                    <option value={"Sauce"}/>
                    <option value={"Powder"}/>
                </datalist>
                <button className={'btn info-btn'} type={'button'} onClick={()=> {
                    arrayHelpers.push({name: '', expires: new Date()})
                    onEdit()
                }}>➕</button>
                {values.ingredients.map((ingredient, index) => (
                    <fieldset className={styles.ingredient} key={index}>
                        <legend>{ingredient.name || `New Ingredient`}</legend>
                        <label>
                            <FastField
                                onBlur={()=>onEdit()}
                                name={`ingredients[${index}].name`}
                                type={'text'}
                                autoComplete={'off'}
                                placeholder={`Name of ingredient`}
                                required
                            />
                        </label>
                        <label>
                            <FastField
                                onBlur={()=>onEdit()}
                                name={`ingredients[${index}].type`}
                                list={`ingredient-types`}
                                type={'text'}
                                autoComplete={'off'}
                                placeholder={`Type of ingredient`}
                                value={ingredient.type || ""}
                                required
                            >
                            </FastField>
                        </label>
                        <label>
                            <small>Expires on:</small>
                            <DatePickerField onBlur={()=>onEdit()} name={`ingredients[${index}].expires`} value={ingredient.expires}/>
                        </label>
                        <button type={'button'} className={'btn danger-btn'} onClick={()=> {
                            onEdit()
                            arrayHelpers.remove(index)
                        }}>➖</button>
                    </fieldset>
                ))}
            </div>
        )}/>
    )
}
type PantryFormProps = {
    editor?: string
    editing?: Pantry
    handleSubmit: (pantry: Partial<Pantry>) => void
}
const PantryForm = ({handleSubmit, editing = newPantry}: PantryFormProps) => {
    return (
        <Formik initialStatus={false} initialValues={editing} onSubmit={({name, ingredients})=> {
            handleSubmit({name, ingredients})
        }}>
            {({values, status, setStatus})=>(
                <Form className={styles.form}>
                    <Prompt when={status} message={`Do you want to leave? You have unsaved progress here.`}/>
                    <label htmlFor={'name'}>
                        <Helmet title={values.name}/>
                        <h1>{values.name || "New Pantry"}</h1>
                        <FastField
                            onBlur={()=>setStatus(true)}
                            name={'name'}
                            type={'text'}
                            placeholder={'Pantry name'}
                            autoComplete={'off'}
                            required
                            maxLength={32}
                        />
                    </label>
                    <IngredientFieldArray onEdit={() => setStatus( true)}/>
                    <button className={'btn danger-btn'} type={'reset'} onClick={()=>setStatus(false)}>Undo</button>
                    <button className={'btn success-btn'} type={'submit'} onClick={()=>setStatus(false)}>Save Pantry</button>
                </Form>
            )}
        </Formik>
    )
}

export default PantryForm