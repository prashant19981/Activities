using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;

namespace Application.Activities
{
    public class ActivityDto
    {
         public Guid ID {get;set;}
        public string Title{get;set;}
        public DateTime Date{get;set;}
        public string Description {get;set;}
        public string Category{get;set;}
        public string City{get;set;}
        public string Venue{get;set;}

        public string HostUsername{get;set;}

        public ICollection<Profile> Attendees{get;set;}

    }
}