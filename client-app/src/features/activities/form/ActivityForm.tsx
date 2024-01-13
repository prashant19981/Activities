import React, { useEffect, useState } from "react";
import { Button, Form, FormField, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observable, values } from "mobx";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from 'yup';

const ActivityForm = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, submitting, loadActivity, loading } = activityStore;
    const [activity, setActivity] = useState<Activity | undefined>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),

    })

    useEffect(() => {
        if (id) {
            loadActivity(id).then((activity) => {
                setActivity(activity!);
            });
        }


    }, [id, loadActivity]);

    // function handleSubmit(){

    //     if(activity){
    //         if(!activity.id){
    //             activity.id = uuid();
    //             createActivity(activity).then(()=>{
    //                 navigate(`/activities/${activity.id}`);
    //         })}
    //         else{
    //             updateActivity(activity).then(()=>{
    //                 navigate(`/activities/${activity.id}`);
    //             })
    //         }
    //     }

    // }
    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;


        setActivity((prevState) => ({
            ...(prevState as Activity),
            [name]: value

        }));

    }
    if (loading || !activity) return <LoadingComponent />
    return (
        <Segment clearing>
            <Formik 
            enableReinitialize 
            validationSchema={validationSchema}
            initialValues={activity} 
            onSubmit={values => console.log(values)}>
                {({ values: activity, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <FormField>
                            <Field onChange={handleFormChange} value={activity.title} name='title' placeholder='Title' />
                            <ErrorMessage name="title"
                            render={error=><Label basic color="red" content={error}/>}/>
                        </FormField>

                        <Field onChange={handleChange} value={activity.description} name='description' placeholder='Description' />
                        <Field onChange={handleChange} value={activity.category} name='category' placeholder='Category' />
                        <Field type="date" onChange={handleChange} value={activity.date} name='date' placeholder='Date' />
                        <Field onChange={handleChange} value={activity.city} name='city' placeholder='City' />
                        <Field onChange={handleChange} value={activity.venue} name='venue' placeholder='Venue' />
                        <Button loading={submitting} floated="right" positive type="submit" content='Submit' />
                        <Button floated="right" positive type="submit" content='Cancel' />
                    </Form>
                )}

            </Formik>
        </Segment>
    )


})

export default ActivityForm;