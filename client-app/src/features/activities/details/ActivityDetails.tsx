import { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';


const ActivityDetails = observer(() => {
    const {id} = useParams();
    const {activityStore} = useStore();
    const {selectedActivity, loadActivity,loading} = activityStore;

    
    useEffect(()=>{
        if(id){
            loadActivity(id);
        }
        
    },[id]);

    if(loading || !selectedActivity){
        return<LoadingComponent/>;
    } 
    return(
    <Grid>
        <Grid.Column width={10}>
            <ActivityDetailedHeader activity={selectedActivity}/>
            <ActivityDetailedInfo activity={selectedActivity}/>
            <ActivityDetailedChat activityId={selectedActivity.id}/>
        </Grid.Column>
        <Grid.Column width={6}>
            <ActivityDetailedSidebar activity={selectedActivity}/>
        </Grid.Column>
    </Grid>
    );
});
export default ActivityDetails;
