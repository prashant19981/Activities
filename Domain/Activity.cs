using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Activity
    {
        public Guid ID {get;set;}
        public string Title{get;set;}
        public DateTime Date{get;set;}
        public string Description {get;set;}
        public string Category{get;set;}
        public string City{get;set;}
        public string Venue{get;set;}

        public Boolean isCancelled {get;set;}

        public ICollection<Comment> Comments {get;set;} = new List<Comment>();

        public ICollection<ActivityAttendee> Attendees{get;set;} = new List<ActivityAttendee>();

    }
}