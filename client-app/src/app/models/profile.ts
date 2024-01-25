import { User } from "./user";

export interface Profile{
    username: string;
    displayName:string;
    image?:string;
    bio?: string;
    photos: Photo[];
}
export interface Photo{
    id:string;
    url:string;
    isMain:boolean;
}

export class Profile implements Profile{
    constructor(user:User){
        this.username = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}