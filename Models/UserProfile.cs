using System;
using adg.Models;
using System.Collections.Generic;

namespace adg.Models
{
    public class UserProfile
    {
        public int UserProfileId { get; set; }
        public string Handle { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }


        public string IdentityId { get; set; } // reference to user
        public ApplicationUser Identity { get; set; }  // navigation property


        public List<Report> Reports { get; set; }

    }
}