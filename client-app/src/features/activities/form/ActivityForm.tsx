import React, { useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik } from "formik";
import * as Yup from 'yup';
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";

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
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required(),
        city: Yup.string().required(),
        venue: Yup.string().required()

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
                        <TextInput name='title' placeholder='Title' />
                        <TextArea row={3} name='description' placeholder='Description' />
                        <TextInput name='category' placeholder='Category' />
                        <TextInput name='date' placeholder='Date' />
                        <TextInput name='city' placeholder='City' />
                        <TextInput name='venue' placeholder='Venue' />
                        <Button loading={submitting} floated="right" positive type="submit" content='Submit' />
                        <Button floated="right" positive type="submit" content='Cancel' />
                    </Form>
                )}

            </Formik>
        </Segment>
    )


})

export default ActivityForm;