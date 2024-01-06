import React, { useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";

const ActivityForm = observer(() => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {activityStore} = useStore();
    const {createActivity,updateActivity,submitting,loadActivity,loading} = activityStore;
    const [activity,setActivity] = useState<Activity | undefined>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });
    useEffect(()=>{
        if(id){
            loadActivity(id).then((activity)=>{
                setActivity(activity!);
            });
        }
        
        
    },[id,loadActivity]);

    function handleSubmit(){
        
        if(activity){
            if(!activity.id){
                activity.id = uuid();
                createActivity(activity).then(()=>{
                    navigate(`/activities/${activity.id}`);
            })}
            else{
                updateActivity(activity).then(()=>{
                    navigate(`/activities/${activity.id}`);
                })
            }
        }

        // } activity.id ? updateActivity(activity) : createActivity(activity)
    }
    function handleFormChange(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
       const {name,value} = event.target;

       
       setActivity((prevState)=>({
        ...(prevState as Activity),
            [name] : value
            
       }));

    }
    if(loading || !activity) return<LoadingComponent/>
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input onChange={handleFormChange} value={activity.title} name='title' placeholder='Title'/>
                <Form.TextArea onChange={handleFormChange} value={activity.description} name='description' placeholder='Description' />
                <Form.Input onChange={handleFormChange} value={activity.category} name='category' placeholder='Category' />
                <Form.Input type="date" onChange={handleFormChange} value={activity.date} name = 'date' placeholder='Date' />
                <Form.Input onChange={handleFormChange} value ={activity.city} name = 'city' placeholder='City' />
                <Form.Input onChange={handleFormChange} value={activity.venue} name = 'venue' placeholder='Venue' />
                <Button loading={submitting} floated="right" positive type="submit" content='Submit' />
                <Button floated="right" positive type="submit" content='Cancel' />


            </Form>
        </Segment>
    )


})

export default ActivityForm ;