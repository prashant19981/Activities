import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    loading: boolean = false;
    editMode: boolean = false;
    submitting: boolean = false;
    constructor() {
        makeAutoObservable(this);
    }
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort
            ((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        )
    }

    loadActivity = async (id: string) => {

        let activity = this.getActivity(id);
        if (activity) {
            this.setSelectedActivity(activity);
            return activity;
        }
        else {
            this.setLoading(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.setSelectedActivity(activity);
                this.setLoading(false);
                return activity;

            }
            catch (error) {
                console.log(error);
                this.setLoading(false);
            }


        }
    }
    setActivity(activity: Activity) {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.userName
            )
            activity.isHost = activity.hostUsername === user.userName;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername)

        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }
    getActivity(id: string) {
        return this.activityRegistry.get(id);
    }
    setActivities = async () => {
        this.setLoading(true);
        try {
            const activities = await agent.Activities.list();

            activities.forEach((activity) => {
                this.setActivity(activity);
            });
            this.setLoading(false);

        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoading(false);
            })

        }
    }
    setLoading = (state: boolean) => {
        this.loading = state;
    }
    setSubmitting = (state: boolean) => {
        this.submitting = state;
    }
    setSelectedActivity = (activity: Activity) => {
        this.selectedActivity = activity;
        this.editMode = true;
    }




    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        // activity.id = uuid();
        try {
                await agent.Activities.create(activity);
                const newActivity = new Activity(activity);
                newActivity.hostUsername = user?.userName!;
                newActivity.attendees = [attendee];
                this.setActivity(newActivity);
                runInAction(() => {
                    this.selectedActivity = newActivity;
                   
        })}
        
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    updateActivity = async (activity: ActivityFormValues) => {
       
        try {
            await agent.Activities.update(activity.id!, activity);
            runInAction(() => {
                if(activity.id){
                    const updatedActivity = {...this.getActivity(activity.id), ...activity};
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = activity as Activity;
                }
                
                
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    deleteActivity = async (id: string) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            })
        }
    }
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.submitting = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.username !== user?.userName);
                    this.selectedActivity.isGoing = false;
                }
                else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        }
        catch (error) {
            console.log(error)
        }
        finally{
            runInAction(()=> this.submitting = false)
        }
    }
    cancelActivity = async ()=>{
        this.submitting = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
            })
        }
        catch(error){
            console.log(error);
        }
        finally{
            runInAction(()=>{
                this.submitting = false;
            })
        }
    }

}