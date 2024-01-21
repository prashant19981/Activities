export interface User{
    userName: string;
    displayName:string;
    token:string;
    image?:string;
}

export interface UserFormValues{
    email:string;
    password:string;
    
    //keeping below two values as optional to use the same interface for login and registration
    
    displayName?:string;
    username?:string;
}