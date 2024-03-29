import { Profile } from "./profile"

export interface Activity {
  id: string
  title: string
  date: Date | null
  description: string
  category: string
  city: string
  venue: string
  hostUsername: string
  isCancelled: boolean
  attendees: Profile[]
  host?: Profile
  isHost: boolean
  isGoing: boolean
}
export class Activity implements Activity{
  constructor(init?: ActivityFormValues){
    Object.assign(this, init);
  }
}

export class ActivityFormValues {
  id?: string = undefined;
  title: string = '';
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';
  date: Date | null = null;

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.description = activity.description;
      this.category = activity.category;
      this.city = activity.city;
      this.venue = activity.venue;
      this.date = activity.date;
      
    }

  }
}
