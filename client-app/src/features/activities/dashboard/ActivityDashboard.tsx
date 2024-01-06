import React, { useEffect } from "react";
import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilter from "./ActivityFilters";
import ActivityFilters from "./ActivityFilters";



const ActvityDashboard = observer(() => {
    const { activityStore } = useStore();
    const { setActivities, loading, activityRegistry } = activityStore;
    useEffect(() => {
        if(activityRegistry.size <= 1) setActivities();

    }, []);
    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />

            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters/>
            </Grid.Column>
        </Grid>
    );

})
export default ActvityDashboard;