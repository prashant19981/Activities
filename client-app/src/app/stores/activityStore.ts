import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
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




    createActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        // activity.id = uuid();
        try {
            agent.Activities.create(activity).then(() => {
                runInAction(() => {
                    // this.activities.push(activity);
                    this.activityRegistry.set(activity.id, activity);
                    // setSubmitting(false);
                    this.selectedActivity = activity;
                    this.editMode = false;
                    this.submitting = false;
                })
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    updateActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.update(activity.id, activity);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
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
        console.log("Called");
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

}