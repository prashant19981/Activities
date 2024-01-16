import React, { useEffect, useState } from "react";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik } from "formik";
import * as Yup from 'yup';
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectionInput from "../../../app/common/form/SelectionInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { v4 as uuid } from "uuid";
const ActivityForm = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, submitting, loadActivity, loading } = activityStore;
    const [activity, setActivity] = useState<Activity | undefined>({
        id: '',
        title: '',
        date: null,
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
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

    function handleFormSubmit(activity: Activity) {

        if (activity) {
            if (!activity.id) {
                activity.id = uuid();
                createActivity(activity).then(() => {
                    navigate(`/activities/${activity.id}`);
                })
            }
            else {
                updateActivity(activity).then(() => {
                    navigate(`/activities/${activity.id}`);
                })
            }
        }

    }

    if (loading || !activity) return <LoadingComponent />
    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <TextInput name='title' placeholder='Title' />
                        <TextArea row={3} name='description' placeholder='Description' />
                        <SelectionInput options={categoryOptions} name='category' placeholder='Category' />
                        <DateInput
                            name='date'
                            placeholderText='Date'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa' />
                        <Header content='Location Details' sub color='teal' />
                        <TextInput name='city' placeholder='City' />
                        <TextInput name='venue' placeholder='Venue' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={submitting}
                            floated="right"
                            positive type="submit"
                            content='Submit' />
                        <Button floated="right" positive type="submit" content='Cancel' />
                    </Form>
                )}

            </Formik>
        </Segment>
    )


})

export default ActivityForm;